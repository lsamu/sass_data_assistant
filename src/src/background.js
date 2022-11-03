'use strict'
import { app, protocol, BrowserWindow, ipcMain, Menu, dialog, ipcRenderer } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
/**
 * 注册
 */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let mainWindow = null
/**
 * 创建窗体
 */
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 810,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (process.env.VUE_APP_DEBUG == "true") {
    //   mainWindow.webContents.openDevTools()
    // }
  } else {
    createProtocol('app')
    mainWindow.loadURL('app://./index.html')
  }
}
/**
 * 所有窗体关闭
 */
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
/**
 * 激活
 */
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
/**
 * 准备
 */
app.on('ready', async function () {
  createWindow()
})
/**
 * 开发者
 */
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', function (data) {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', function () {
      app.quit()
    })
  }
}
