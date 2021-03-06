import { IpcRenderer } from 'electron'
import { Messages } from '../../shared/upnp/types'
import { Result } from '../../main/upnp/service'
import { parse } from 'fast-xml-parser'
import he, { DecodeOptions } from 'he'

let ipcRenderer: IpcRenderer

export function init (ipc: IpcRenderer): void {
  ipcRenderer = ipc
}

type XMLResult = Result<{
  Result: string
}>

export type BrowseItem = {
  id: string
  title: string
  creator: string
  date: string
  artist: string
  album: string
  durations: string[]
  sizes: number[]
  trackNumber: string | undefined
}

function safeDecode (input: string | number | null | undefined, options?: DecodeOptions): string {
  if (input === null || input === undefined) {
    return ''
  }
  if (typeof input === 'number') {
    return input.toString(10)
  }
  return he.decode(input, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function itemItems (container: any): Array<BrowseItem> {
  if (!container) {
    return []
  }

  const wrapped = Array.isArray(container) ? container : [container]
  return wrapped.map(item => {
    return {
      id: item.attr['@_id'],
      title: safeDecode(item['dc:title']),
      creator: safeDecode(item['dc:creator']),
      date: safeDecode(item['dc:date']),
      artist: safeDecode((Array.isArray(item['upnp:artist']) ? item['upnp:artist'][0] : item['upnp:artist'])),
      album: safeDecode(item['upnp:album']),
      // @ts-expect-error asdf
      durations: item.res.map(r => safeDecode(r.attr['@_duration'], { isAttributeValue: true })),
      // @ts-expect-error asdf
      sizes: item.res.map(r => parseInt(r.attr['@_size'], 10)),
      trackNumber: safeDecode(item['upnp:originalTrackNumber'])
    }
  })
}

type BrowseResponse = {
  container: Array<{
    id: string
    title: string
  }>
  item: Array<BrowseItem>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function browseXml (xml: any): BrowseResponse {
  // console.log(xml)
  const rawContainerItems = xml['DIDL-Lite'].container
  const container = containerItems(rawContainerItems)
  const rawItem = xml['DIDL-Lite'].item
  const item = itemItems(rawItem)
  return { container, item }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function containerItems (container: any): Array<{
  id: string
  title: string
}> {
  if (!container) {
    return []
  }
  if (Array.isArray(container)) {
    return container.map(item => {
      return {
        id: item.attr['@_id'],
        title: he.decode(item['dc:title'])
      }
    })
  } else {
    return [{
      id: container.attr['@_id'],
      title: he.decode(container['dc:title'])
    }]
  }
}

const upnpClient = {
  setUrl: async (url: string): Promise<void> => {
    await ipcRenderer.invoke(Messages.NewClient, url)
  },

  getDeviceDescription: async (): Promise<Result> => {
    return await ipcRenderer.invoke(Messages.GetDeviceDescription)
  },

  getServiceDescription: async (service: string): Promise<Result> => {
    return await ipcRenderer.invoke(Messages.GetServiceDescription, service)
  },

  callAction: async (service: string, action: string, parameters: Record<string, string>): Promise<XMLResult> => {
    return await ipcRenderer.invoke(Messages.CallAction, service, action, parameters)
  },

  browse: async (objectID = '0'): Promise<BrowseResponse> => {
    const parameters = {
      ObjectID: objectID,
      BrowseFlag: 'BrowseDirectChildren',
      Filter: '*',
      StartingIndex: '0',
      RequestedCount: '0',
      SortCriteria: ''
    }
    const { result: { Result: result } } = await upnpClient.callAction('ContentDirectory', 'Browse', parameters)

    return browseXml(parse(result, { attrNodeName: 'attr', ignoreAttributes: false }))
  }
}

export default upnpClient
