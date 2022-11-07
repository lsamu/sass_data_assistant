import { app, BrowserWindow, shell, ipcMain,Tray,Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
const path = require('path')

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(process.env.DIST, 'index.html')

let tray:any = null  // 在外面创建tray变量，防止被自动删除，导致图标自动消失

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1100,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    frame: false
  })

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  //  // 创建任务栏图标
  tray = new Tray("./public/favicon.ico")

   // 自定义托盘图标的内容菜单
   const contextMenu = Menu.buildFromTemplate([
     {
       // 点击退出菜单退出程序
       label: '退出', click: function () {
         win?.destroy()
         app.quit()
       }
     }
   ])
 
   tray.setToolTip('游戏加速器')  // 设置鼠标指针在托盘图标上悬停时显示的文本
   tray.setContextMenu(contextMenu)  // 设置图标的内容菜单
   // 点击托盘图标，显示主窗口
   tray.on("click", () => {
     win?.show();
   })
}

ipcMain.on("mini",()=>{
  win?.minimize()
})

ipcMain.on("quit",()=>{
  app.quit()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
