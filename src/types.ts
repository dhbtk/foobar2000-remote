export interface ActiveItem {
  columns: string[]
  duration: number
  index: number
  playlistId: string
  playlistIndex: number
  position: number
}

export type PlaybackState = 'stopped' | 'playing' | 'paused'

export interface Player {
  activeItem: ActiveItem
  info: {
    name: string
    pluginVersion: string
    title: string
    version: string
  }
  playbackMode: number
  playbackModes: string[]
  playbackState: PlaybackState
}

export interface PlaylistInfo {
  id: string
  index: number
  title: string
  isCurrent: boolean
  itemCount: number
  totalTime: number
}

export interface QueryResponse {
  player: Player
  playlists: PlaylistInfo[]
}

export interface PlaylistItemList {
  offset: number
  totalCount: number
  items: { columns: string[] }[]
}

export interface PlayerState {
  player: Player
  playlists: PlaylistInfo[]
  playlistItems: Record<string, PlaylistItemList>
}
