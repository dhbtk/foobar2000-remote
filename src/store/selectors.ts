import { RootState } from './index'
import { ActiveItem, PlaybackState, Player, PlaylistInfo } from '../types'
import { createSelector } from 'reselect'
import { apiUrl } from '../api/api'

export const getPlaybackState = (state: RootState): PlaybackState => state.player.player.playbackState
export const getPlayerState = (state: RootState): Player => state.player.player
export const getMediaImage = createSelector(
  [
    getPlaybackState,
    (state: RootState) => `${state.player.player.activeItem.playlistId}/${state.player.player.activeItem.index}`
  ],
  (playbackState, path) => {
    if (playbackState === 'stopped') {
      return ''
    } else {
      return `${apiUrl}/artwork/${path}`
    }
  }
)

export const getMetadata = createSelector(
  [
    getPlaybackState,
    (state) => state.player.player.activeItem.columns[1],
    (state) => state.player.player.activeItem.columns[0],
    (state) => state.player.player.activeItem.columns[2],
    getMediaImage
  ],
  (playbackState, title, artist, album, src) => {
    if (playbackState === 'stopped') {
      return null
    } else {
      return {
        title,
        artist,
        album,
        artwork: [{ src }]
      }
    }
  }
)

const getSongId = createSelector(
  [
  (state: RootState) => state.player.player.activeItem.columns[1],
  (state) => state.player.player.activeItem.columns[0],
  (state) => state.player.player.activeItem.columns[2]
    ],
  () => {
    return Math.round(Math.random() * 100000)
  }
)

export const getNativeMetadata = createSelector(
  [
    getPlaybackState,
    (state) => state.player.player.activeItem.columns[1],
    (state) => state.player.player.activeItem.columns[0],
    (state) => state.player.player.activeItem.columns[2],
    getMediaImage,
    getSongId,
    (state) => state.player.player.activeItem.position * 1000,
    (state) => state.player.player.activeItem.duration * 1000
  ],
  (playbackState, title, artist, album, src, songId, position, duration) => {
    return {
      title,
      artist,
      album,
      artPath: src,
      state: playbackState,
      id: songId,
      currentTime: position,
      duration
    }
  }
)

export const getVolume = (state: RootState): number => state.local.volume

export const getPlaylistNames = (state: RootState): string[] => state.player.playlists.map(p => p.title)
export const getSelectedPlaylistIndex = (state: RootState): number => {
  return state.player.playlists.find(p => p.isCurrent)?.index ?? -1
}

export const getPlaylist: (i: number) => (s: RootState) => PlaylistInfo = (index) => (state) => state.player.playlists[index]
export const getActiveItem = (state: RootState): ActiveItem => state.player.player.activeItem
