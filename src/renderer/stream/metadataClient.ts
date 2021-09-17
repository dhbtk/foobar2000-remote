import api from '../api/api'
import { Metadata } from 'electron-media-service'

const { ipcRenderer } = window.require('electron')

export function setupRenderer (): void {
  ipcRenderer.on('media-event', (_event, type: string, to: number) => {
    if (type === 'play') {
      api.play()
    } else if (type === 'pause') {
      api.pause()
    } else if (type === 'playPause') {
      api.playPause()
    } else if (type === 'next') {
      api.next()
    } else if (type === 'previous') {
      api.previous()
    } else if (type === 'seek') {
      api.seek(to * 1000)
    }
  })
}

export function updateMetadata (metadata: Metadata): void {
  ipcRenderer.send('media-metadata', metadata)
}
