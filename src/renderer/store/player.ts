import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import oldApi from '../api/api'
import { Player, PlayerState, PlaylistInfo } from '../../shared/types'

export const loadPlayerState = createAsyncThunk('loadPlayerState', async () => {
  return await oldApi.updateState()
})

export const setPlayerInfo = createAction<{ player: Player, timestamp: number }>('setPlayerInfo')
export const setPlaylistsInfo = createAction<{ playlists: PlaylistInfo[], timestamp: number }>('setPlaylistsInfo')
export const setCurrentPosition = createAction<number>('setCurrentPosition')

const initialState: PlayerState = {
  player: {
    activeItem: {
      columns: ['', '', ''],
      index: 0,
      playlistId: '',
      duration: 0,
      playlistIndex: 0,
      position: 0
    },
    playbackState: 'stopped',
    info: {
      name: '',
      pluginVersion: '',
      title: '',
      version: ''
    },
    playbackMode: 0,
    playbackModes: []
  },
  playlists: [],
  playlistItems: {},
  timestamp: new Date().getTime(),
  loaded: false
}

export default createReducer(initialState, builder => {
  builder.addCase(loadPlayerState.fulfilled, (state, { payload }) => {
    state.player = payload.player
    state.playlists = payload.playlists
    state.loaded = true
  })
  builder.addCase(setPlayerInfo, (state, { payload: { player, timestamp } }) => {
    state.player = player
    state.timestamp = timestamp
    state.loaded = true
  })
  builder.addCase(setPlaylistsInfo, (state, { payload: { playlists, timestamp } }) => {
    state.playlists = playlists
    state.timestamp = timestamp
    state.loaded = true
  })
  builder.addCase(setCurrentPosition, (state, { payload: currentTimestamp }) => {
    if (state.player.playbackState === 'playing') {
      const delta = (currentTimestamp - state.timestamp) / 1000
      state.player.activeItem.position = Math.min(state.player.activeItem.position + delta, state.player.activeItem.duration)
      state.timestamp = currentTimestamp
    }
  })
})
