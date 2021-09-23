import { ipcMain } from 'electron'
import { Client as SsdpClient } from 'node-ssdp'

export function ssdpSetup (): void {
  ipcMain.handle('ssdp-search', (event, query) => new Promise((resolve) => {
    const ssdpClient = new SsdpClient()
    ssdpClient.on('response', (data: { LOCATION: string }) => {
      console.log(data)
      resolve(data.LOCATION)
    })
    ssdpClient.search(query)
  }))
}
