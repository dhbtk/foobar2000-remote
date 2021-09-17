import { createAction, createReducer } from '@reduxjs/toolkit'

export const setVolume = createAction<number>('setVolume')

export default createReducer({ volume: 100 }, builder => {
  builder.addCase(setVolume, (state, { payload }) => {
    state.volume = payload
  })
})
