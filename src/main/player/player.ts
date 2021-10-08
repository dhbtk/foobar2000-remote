import { ipcMain } from 'electron'
import { setVolume, streamStart, streamStop } from './worker'

export function playerSetup (): void {
  ipcMain.handle('stream-start', () => {
    streamStart()
  })

  ipcMain.handle('stream-stop', () => {
    streamStop()
  })

  ipcMain.handle('stream-set-volume', (_, volume: number) => {
    setVolume(volume)
  })
}
