import '../index.css'
import { start } from './ui/App'
import upnpClient, { init } from './upnp/client'
import api from './api/api'

async function findFoobar() {
  const ipcRenderer = window.require('electron').ipcRenderer
  init(ipcRenderer)
  const url = 'http://192.168.18.3:56923/DeviceDescription.xml'
  // const url = await ipcRenderer.invoke('ssdp-search', 'urn:schemas-upnp-org:service:ContentDirectory:1')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window['upnpClient'] = upnpClient
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window['fooApi'] = api

  await upnpClient.setUrl(url)
  console.log(`found foobar at ${url}`)
}

findFoobar().then(() => start())
