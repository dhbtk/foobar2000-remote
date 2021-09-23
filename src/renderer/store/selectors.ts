import { RootState } from './index'
import { ActiveItem, PlaybackState, Player, PlaylistInfo } from '../../shared/types'
import { createSelector } from 'reselect'
import { apiUrl, columnInfo } from '../api/api'
import { Album, Song } from './library/types'
import createCachedSelector from 're-reselect'

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
    getMediaImage,
    (state) => columnInfo(state.player.player.activeItem.columns)
  ],
  (playbackState, title, artist, album, src, itemInfo) => {
    if (playbackState === 'stopped') {
      return null
    } else {
      return {
        title,
        artist,
        album,
        artwork: [{ src }],
        itemInfo
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
      title: title || '',
      artist: artist || '',
      album: album || '',
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

export const getScanStatus = (s: RootState): { syncing: boolean, scanned: number, totalSongs: number } => {
  const { syncing, scanned, totalSongs } = s.library
  return { syncing, scanned, totalSongs }
}

export type AlbumWithSongs = Album & { songs: Song[] }
export const getAlbumsForDisplay = createSelector(
  [
    (s: RootState) => s.library.albumIds,
    s => s.library.albums,
    s => s.library.songIds,
    s => s.library.songs
  ],
  (albumIds, albums, songIds, allSongs): AlbumWithSongs[] => {
    return albumIds.map(id => {
      const album = albums[id]
      const songs = album.songIds.map(id => allSongs[id]).filter(Boolean)
      songs.sort((a, b) => parseInt(a.trackNumber, 10) - parseInt(b.trackNumber, 10))
      return {...album, songs }
    })
  }
)

export const getAlbumForDisplay = createCachedSelector(
  [
    (state: RootState, albumId: number) => state.library.albums[albumId],
    s => s.library.songs
],
  (album, allSongs): AlbumWithSongs => {
    const songs = album.songIds.map(id => allSongs[id]).filter(Boolean)
    songs.sort((a, b) => parseInt(a.trackNumber, 10) - parseInt(b.trackNumber, 10))
    return {...album, songs }
  }
)((state, albumId) => albumId)

export const getAlbumIds = (s: RootState): number[] => s.library.albumIds
