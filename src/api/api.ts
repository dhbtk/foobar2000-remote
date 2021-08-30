import { QueryResponse } from '../types'

export const streamUrl = 'http://foo:bar@192.168.18.3:56923/content/psc.mp3'
export const apiUrl = 'http://desktop-ikn2fef.local:8880/api'
export const contentDirectoryUrl = 'http://192.168.18.3:56923/DeviceDescription.xml'
export const avTransportUrl = 'http://192.168.18.3:1046/'
export const columns = [
  '%artist%', '%title%', '%album%', '%album artist%', '%date%', '%genre%', '%tracknumber%', '%totaltracks%',
  '%discnumber%', '%totaldiscs%', '%codec%', '%length%', '%bitrate%', '%filesize_natural%', '%last_modified%',
  '%channels%', '%filesize%', '%length_ex%', '%length_samples%', '%samplerate%', '%filename_ext%', '%path%',
  '%subsong%', '%comment%' ]

export type FileColumns = {
  artist: string
  title: string
  album: string
  albumArtist: string
  date: string
  genre: string
  trackNumber: string
  totalTracks: string
  discNumber: string
  totalDiscs: string
  codec: string
  length: string
  bitrate: string
  filesize: string
  lastModified: string
  channels: string
  rawFilesize: string
  exactLength: string
  sampleLength: string
  sampleRate: string
  filename: string
  path: string
  subsong: string
  comment: string
}

export const columnInfo: (c: string[]) => FileColumns = c => ({
  artist: c[0],
  title: c[1],
  album: c[2],
  albumArtist: c[3],
  date: c[4],
  genre: c[5],
  trackNumber: c[6],
  totalTracks: c[7],
  discNumber: c[8],
  totalDiscs: c[9],
  codec: c[10],
  length: c[11],
  bitrate: c[12],
  filesize: c[13],
  lastModified: c[14],
  channels: c[15],
  rawFilesize: c[16],
  exactLength: c[17],
  sampleLength: c[18],
  sampleRate: c[19],
  filename: c[20],
  path: c[21],
  subsong: c[22],
  comment: c[23]
})

export type Entry = {
  name: string
  path: string
  type: 'D' | 'F'
  size: number
  timestamp: number
}

export type Roots = {
  pathSeparator: string
  roots: Array<Entry>
}

export type Entries = {
  pathSeparator: string
  entries: Array<Entry>
}

export default {
  updateState: async (): Promise<QueryResponse> => {
    const params = new URLSearchParams({
      player: 'true',
      playlists: 'true',
      playlistItems: 'false',
      trcolumns: columns.join(','),
    })
    const response = await fetch(`${apiUrl}/query?${params}`)
    return await response.json() as QueryResponse
  },
  play: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/play`, { method: 'POST' })
  },
  pause: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/pause`, { method: 'POST' })
  },
  playPause: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/pause/toggle`, { method: 'POST' })
  },
  seek: async (secs: number): Promise<void> => {
    await fetch(`${apiUrl}/player?position=${Math.round(secs)}`, { method: 'POST' })
  },
  next: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/next`, { method: 'POST' })
  },
  previous: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/previous`, { method: 'POST' })
  },
  stop: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/stop`, { method: 'POST' })
  },
  random: async (): Promise<void> => {
    await fetch(`${apiUrl}/player/play/random`, { method: 'POST' })
  },
  playItem: async (id: string, index: number | string): Promise<void> => {
    await fetch(`${apiUrl}/player/play/${id}/${index}`, { method: 'POST' })
  },
  browseRoots: async (): Promise<Roots> => {
    return await fetch(`${apiUrl}/browser/roots`).then(r => r.json())
  },
  browseEntries: async (path: string): Promise<Entries> => {
    const params = new URLSearchParams({ path })
    return await fetch(`${apiUrl}/browser/entries?${params}`).then(r => r.json())
  }
}
