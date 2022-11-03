'use strict'
import { app, protocol, BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import Enumerable from 'linq'
import { BrowserContext } from 'puppeteer'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])



async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: (process.env
      //     .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      webviewTag: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST){ 
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

app.commandLine.appendSwitch("--remote-debugging-port", "8310");
// app.commandLine.appendSwitch("remote-debugging-port","8315");

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const puppeteer = require('./puppeteer-electron')

ipcMain.on("spider", async (event) => {
  console.log("44444");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--remote-debugging-port=8315"
    ]
  })
  //新链接
  // await browser.on("targetcreated",(target)=>{
  //   console.log(target);
  // });
  // await browser.on("Target.createTarget",(target)=>{
  //   console.log(target);
  // });
  //console.log(app);
  const pages = await browser.pages()
  const [page] = pages
  let response = await page.goto("https://so.com");
  console.log("55555");
  //const page2 = await browser.newPage();
  if (response.ok()) {
    let input = await page.$$("#input");
    input[0].type("奶粉");

    let btn = await page.$$("#search-button");
    btn[0].click();
  }
});

const axios = require("axios")
const puppeteer_core = require('puppeteer-core')

ipcMain.on("spider_test", async (event) => {
  console.log("44444");
  //json/list
  const ret = await axios.get("http://127.0.0.1:8310/json/version");
  const browserWSEndpoint = ret.data.webSocketDebuggerUrl;
  const browser: BrowserContext = await puppeteer_core.connect({ browserWSEndpoint, slowMo: null, defaultViewport: null })
  let targets = await browser.targets();
  console.log("targets:"+targets.length)
  console.log("pages:"+ (await browser.pages()).length);
  let frame = await targets.find(p=>(p.type() as string)==="webview").page();
  let page = frame;//.frames()[0]

  let response = await page.goto("https://so.com");
  if (response.ok()) {
    page.title();
    let input = await page.$("#input");
    input.type("奶粉");

    let btn = await page.$("#search-button");
    btn.click();
  }
  console.log("55555");
});

/*

import Nightmare from 'eramthgin'

//eramthgin
ipcMain.on('go-spider', async event => {
  // 初始化nightmare对象
  const page = Nightmare({
    show: true, //是否显示爬虫窗口
    gotoTimeout: 10000
  });
  page.on("page",(a,b,c)=>{
    console.log(a);
    console.log(b);
    console.log(c);
  });
  await page.goto("http://www.baidu.com");
  await page.type("#kw","奶粉")
  await page.wait(2000)
  await page.click("#su")
})

//puppeteer
ipcMain.on('go-spider-puppeteer', event => {
  console.log("go-spider-puppeteer");
});

const run = require('./utils/vm');

ipcMain.on('go-spider-puppeteer-vm2',  event => {
  console.log("go-spider-puppeteer-vm2");
  let code = ` 
  function aa(){
    return 11;
  }
  aa();
  `
  run(code);
});

*/