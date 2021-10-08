import { ssdpSetup } from './ssdp'
import { upnpSetup } from './upnp/service'
import { app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions, shell } from 'electron'
import { setupMetadata } from './metadata/service'
import { playerSetup } from './player/player'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const CONFIG_WINDOW_WEBPACK_ENTRY: string

export function configureApp (): void {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
  }
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
  app.commandLine.appendSwitch('disable-site-isolation-trials')

  app.name = 'foobar2000-remote'
  app.setAboutPanelOptions({
    applicationName: 'foobar2000-remote',
    applicationVersion: process.env.npm_package_version,
    copyright: '(c) 2021 @dhbtk',
    version: '69420'
  })
}

export function setupModules (): void {
  ssdpSetup()
  upnpSetup(ipcMain)
  playerSetup()
}

export function createWindow (): void {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false
    }
  })
  mainWindow.maximize()
  mainWindow.show()
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  setupMetadata(mainWindow)
}

let configWindow: BrowserWindow | null = null

export function createConfigWindow (): void {
  if (configWindow === null) {
    configWindow = new BrowserWindow({
      show: true,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        webSecurity: false
      }
    })
    configWindow.loadURL(CONFIG_WINDOW_WEBPACK_ENTRY)
    configWindow.on('close', () => {
      configWindow = null
    })
  } else {
    configWindow.show()
  }
}

function setupMenu () {
  const isMac = process.platform === 'darwin'

  const template: Array<MenuItemConstructorOptions> = [
    // {  }
    {
      role: 'appMenu',
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: isMac ? 'CommandOrControl+,' : 'CommandOrControl-P',
          click: () => createConfigWindow()
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    // {  }
    {
      role: 'fileMenu',
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // {  }
    {
      role: 'editMenu',
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ]
    },
    // {  }
    {
      role: 'viewMenu',
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // {  }
    {
      role: 'windowMenu',
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

export function configureAppLifecycle (): void {
  app.on('ready', setupMenu)
  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}
