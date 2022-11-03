
const { VM } = require('vm2');

export default function(code){
  code = `
  const log = [];

  // Define inline functions and capture user console logs.
  const logger = (...args) => log.push(args);
  console.log = logger;
  console.info = logger;
  console.warn = logger;

  //const sleep = ${sleep.toString()}; // inline function
  //const fileCreated = ${setupFileCreationWatcher.toString()}(); // inline function

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

  //需要处理输出 输入 方法
  const vm = new VM({
    timeout: 40 * 1000,
  }).run(code);
  console.log(JSON.stringify(vm));
}
