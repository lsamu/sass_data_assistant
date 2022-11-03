'use strict';
const fs = require('fs');
const mime = require('mime');
const upload = require('multer')();
const { VM } = require('vm2');
const puppeteer = require('puppeteer');

const REUSE_CHROME = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Async route handlers are wrapped with this to catch rejected promise errors.
const catchAsyncErrors = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

function setupFileCreationWatcher() {
    // TODO: do more than this to cleanup + prevent malicious deeds.
    return new Promise((resolve, reject) => {
        const watcher = fs.watch('./', { recursive: true }, (eventType, filename) => {
            watcher.close();
            resolve(filename);
        });
    });
}

/**
 * @param {!Promise<string>} fileCreated
 * @param {!Array<string>} log
 * @return {!Promise<!Object>}
 */
async function buildResponse(fileCreated, log) {
    const respObj = { log: log.join('\n') };
    // If a screenshot/pdf was saved, get its filename and mimetype.
    // Wait a max of 100ms for a file to be created. The race is necessary
    // because the promise may never never resolve if the user's code never
    // attempts to create a file.
    const filename = await Promise.race([fileCreated, sleep(100)]);
    if (filename) {
        respObj.result = {
            type: mime.getType(filename),
            buffer: fs.readFileSync(filename)
        };
        fs.unlinkSync(filename); // Remove the file that the user created.
    }
    return respObj;
}

/**
 * @param {string} code User code to run.
 * @param {Browser=} browser An instance of Chrome to connect to. Assumes the
 *     user's code launches Chrome if not provided.
 * @return {!Promise}
 */
async function runCodeInSandbox(code, browser = null) {
    let closeBrowserOrPageCall = 'browser.close();';

    if (code.match(/file:/g) || code.match(/metadata\.google\.internal/g)) {
        throw new Error('Sorry. Cannot access that URL.');
    }

    const lines = code.split('\n');
    const launchLine = lines.findIndex(line => line.includes('.launch('));
    if (launchLine != -1) {
        const targetWatchCode = `
    browser.on('targetcreated', async target => {
      const page = await target.page();
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.url().startsWith('file') || req.url().includes('metadata.google.internal')) {
          req.abort();
        } else {
          req.continue();
        }
      });
    });`;

        lines.splice(launchLine + 1, 0, targetWatchCode);
        code = lines.join('\n');
    }

    if (REUSE_CHROME && browser) {
        const browserWSEndpoint = await browser.wsEndpoint();

        // Rewrite user code to reconnect to Chrome that is already running instead
        // of launching a new browser instance every run.
        code = code.replace(/\.launch\([\w\W]*?\)/g,
            `.connect({browserWSEndpoint: "${browserWSEndpoint}"})`);

        // Replace user code that closes the browser.
        code = code.replace(/(.*\.close\(\))/g, '// $1');

        closeBrowserOrPageCall = 'page.close();';
    } else {
        // TODO: figure out why this is needed now. User in docker image was
        // enough before. Possible GAE changed permissions.
        code = code.replace(/\.launch\([\w\W]*?\)/g,
            ".launch({args: ['--no-sandbox', '--disable-dev-shm-usage']})");
    }

    code = `
    const log = [];

    // Define inline functions and capture user console logs.
    const logger = (...args) => log.push(args);
    console.log = logger;
    console.info = logger;
    console.warn = logger;

    const sleep = ${sleep.toString()}; // inline function
    const fileCreated = ${setupFileCreationWatcher.toString()}(); // inline function

    // Wrap user code in an async function so async/await can be used out of the box.
    (async() => {
      ${code} // user's code

      // Attempt to close the page/browser even if the regex fails to catch the
      // call. This assumes they've used a var called "page" or "browser".
      try {
        await ${closeBrowserOrPageCall}
      } catch (err) {
        // noop
      }
      return ${buildResponse.toString()}(fileCreated, log); // inline function, call it
    })();
  `;

    const fsFunc = (func, ...args) => {
        const filename = args[0];
        // Restrict file reads to images, pdfs.
        if (/^(\w|\.\/)+\.(png|jpg|jpeg|pdf)$/m.test(filename)) {
            return func(...args);
        }
        throw Error(`ENOENT: no such file or directory, open '${filename}'`);
    };

    // Sandbox user code. Provide new context with limited scope.
    const sandbox = {
        mime,
        setTimeout,
        puppeteer,
        fs: {
            watch: fs.watch,
            readFileSync: (...args) => fsFunc(fs.readFileSync, ...args),
            unlinkSync: (...args) => fsFunc(fs.unlinkSync, ...args)
        }
    };

    return new VM({
        timeout: 40 * 1000,
        sandbox,
    }).run(code);
}

module.exports.run = async (code) => {
    let browser;
    console.info('Starting new Chrome instance...');
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const pages = await browser.pages();
    if (pages.length) {
        await Promise.all(pages.map(page => page.close()));
    }
    try {
        const result = await runCodeInSandbox(code, browser); // await runCodeUsingSpawn(code);
        console.log(result);
    } catch (err) {
        throw err;
    }
}