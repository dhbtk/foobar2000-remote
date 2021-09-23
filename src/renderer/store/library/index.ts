import { Album, Song } from './types'
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../index'
import { rescan } from './scanner'
import { getAlbums, getSongs } from './database'

interface State {
  songs: Record<number, Song>
  songIds: number[]
  albums: Record<number, Album>
  albumIds: number[]
  syncing: boolean
  scanned: number
  totalSongs: number
  expandedAlbums: number[]
}

const initialState: State = {
  songs: {},
  songIds: [],
  albums: {},
  albumIds: [],
  syncing: false,
  scanned: 0,
  totalSongs: 0,
  expandedAlbums: []
}

export const setScanData = createAction<{ syncing: boolean, scanned: number, totalSongs: number }>('setScanData')
export const setAlbums = createAction<Album[]>('setAlbums')
export const setSongs = createAction<Song[]>('setSongs')
export const toggleAlbumOpen = createAction<number>('toggleAlbumOpen')

export const rescanLibrary = createAsyncThunk<void,
  boolean,
  {
    dispatch: AppDispatch
    state: RootState
  }>('rescanLibrary', async (reset, { dispatch }) => {
  dispatch(setScanData({ syncing: true, scanned: 0, totalSongs: 0 }))
  await rescan((scanned, totalSongs) => {
    dispatch(setScanData({ syncing: true, scanned, totalSongs }))
  }, reset)
  dispatch(setAlbums(await getAlbums()))
  dispatch(setSongs(await getSongs()))
  dispatch(setScanData({ syncing: false, scanned: 0, totalSongs: 0 }))
})

export const loadAlbums = createAsyncThunk<void, void, { dispatch: AppDispatch }>('loadAlbums', async (_, { dispatch }) => {
  dispatch(setSongs(await getSongs()))
  dispatch(setAlbums(await getAlbums()))
})

export default createReducer(initialState, builder => {
  builder.addCase(setScanData, (state, { payload: { syncing, scanned, totalSongs } }) => {
    state.syncing = syncing
    state.scanned = scanned
    state.totalSongs = totalSongs
  })
  builder.addCase(setAlbums, (state, { payload: albums }) => {
    const dictionary: Record<number, Album> = {}
    const ids: number[] = []
    for (const album of albums) {
      ids.push(album.id)
      if (album.date.endsWith('-01-01')) {
        album.date = album.date.replace('-01-01', '')
      }
      dictionary[album.id] = album
    }
    state.albums = dictionary
    state.albumIds = ids
    state.expandedAlbums = []
  })
  builder.addCase(setSongs, (state, { payload: songs }) => {
    const dictionary: Record<number, Song> = {}
    const ids: number[] = []
    for (const song of songs) {
      ids.push(song.id)
      dictionary[song.id] = song
    }
    state.songs = dictionary
    state.songIds = ids
  })
  builder.addCase(toggleAlbumOpen, (state, { payload: id }) => {
    if (state.expandedAlbums.includes(id)) {
      state.expandedAlbums = state.expandedAlbums.filter(n => n !== id)
    } else {
      state.expandedAlbums.push(id)
    }
  })
  builder.addCase(loadAlbums.pending, (state) => {
    state.syncing = true
  })
  builder.addCase(loadAlbums.fulfilled, (state) => {
    state.syncing = false
  })
})
