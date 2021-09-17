import { BrowserWindow, ipcMain } from 'electron'
import MediaService, { Metadata } from 'electron-media-service'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import tempDir from 'temp-dir'

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

let lastSongId = -1
let lastArtPath = ''

ipcMain.on('media-metadata', (_, metadata: Metadata) => {
  if (metadata.id !== lastSongId && metadata.artPath) {
    lastSongId = metadata.id
    console.log('fetching: ' + metadata.artPath)
    fetch(metadata.artPath).then(response => {
      if (response.ok) {
        const extension = (response.headers.get('content-type') || 'image/jpeg').split('/')[1]
        const fileName = path.join(tempDir, `${metadata.id}.${extension}`)
        console.log('file name: ' + fileName)
        const destStream = fs.createWriteStream(fileName)
        const body = response.body
        body.on('end', () => {
          lastArtPath = fileName
          metadata.artPath = lastArtPath
          console.log('sending metadata to native service')
          mediaService.setMetaData(metadata)
        })
        body.pipe(destStream)
      } else {
        console.log('fetch failed')
        lastArtPath = ''
        metadata.artPath = lastArtPath
        mediaService.setMetaData(metadata)
      }
    }, () => {
      console.log('fetch rejected')
      lastArtPath = ''
      metadata.artPath = lastArtPath
      mediaService.setMetaData(metadata)
    })
  } else {
    metadata.artPath = lastArtPath
    console.log('sending metadata as-is: ' + JSON.stringify(metadata))
    mediaService.setMetaData(metadata)
  }
})
