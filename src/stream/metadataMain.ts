import { BrowserWindow, ipcMain } from 'electron'
import MediaService from 'electron-media-service'

const eventTypes = ['play', 'pause', 'playPause', 'next', 'previous', 'seek']
const mediaService = new MediaService()
console.log('starting service')
mediaService.startService()

export function setup (window: BrowserWindow): void {
  eventTypes.forEach(type => {
    mediaService.on(type, (to) => {
      window.webContents.send('media-event',type, to)
    })
  })
}

ipcMain.on('media-metadata', (_, metadata) => {
  console.log('setting metadata: ' + JSON.stringify(metadata))
  mediaService.setMetaData(metadata)
})
