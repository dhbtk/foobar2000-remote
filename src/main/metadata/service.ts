import { BrowserWindow, ipcMain } from 'electron'
import MediaService, { Metadata } from 'electron-media-service'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import tempDir from 'temp-dir'

export const eventTypes = ['play', 'pause', 'playPause', 'next', 'previous', 'seek'] as const
type MediaEvent = typeof eventTypes[number]

const mediaService = new MediaService()
mediaService.startService()

let currentWindow: BrowserWindow | undefined = undefined

eventTypes.forEach(type => {
  mediaService.on(type, (to) => {
    currentWindow?.webContents?.send('media-event',type, to)
  })
})

export function setupMetadata (window: BrowserWindow): void {
  currentWindow = window
}

export function sendEvent (event: MediaEvent, to = 0): void {
  currentWindow?.webContents?.send('media-event', event, to)
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
          console.log('sending metadata to native service: ' + JSON.stringify(metadata))
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
    mediaService.setMetaData(metadata)
  }
})
