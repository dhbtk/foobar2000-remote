import { IpcMain } from 'electron'
import { Messages } from '../../shared/upnp/types'
import Client, { Callback } from 'upnp-device-client'

let client: Client

export interface Result<T = unknown> {
  error: Error | undefined
  result: T
}

const promise = (resolve: (r: Result) => void): Callback => (error, result) => resolve({ error, result })

export function setup (ipcMain: IpcMain): void {
  ipcMain.handle(Messages.NewClient, (event, url) => {
    client = new Client(url)
  })

  ipcMain.handle(Messages.GetDeviceDescription, () => {
    return new Promise((resolve) => client.getDeviceDescription(promise(resolve)))
  })

  ipcMain.handle(Messages.GetServiceDescription, (event, service: string) => {
    return new Promise((resolve) => client.getServiceDescription(service, promise(resolve)))
  })

  ipcMain.handle(Messages.CallAction, (event, service, action, parameters) => {
    return new Promise((resolve) => client.callAction(service, action, parameters, promise(resolve)))
  })
}
