import { createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import oldApi from '../api/api'
import { PlayerState } from '../../shared/types'

export const loadPlayerState = createAsyncThunk('loadPlayerState', async () => {
  return await oldApi.updateState()
})

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
  playlistItems: {}
}

export default createReducer(initialState, builder => {
  builder.addCase(loadPlayerState.fulfilled, (state, { payload }) => {
    state.player = payload.player
    state.playlists = payload.playlists
  })
})
