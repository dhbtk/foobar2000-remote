import { combineReducers } from 'redux'
import player from './player'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import local, { setVolume } from './local'
import { api } from './api'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { getVolume } from './selectors'
import library from './library'

const rootReducer = combineReducers({ player, local, [api.reducerPath]: api.reducer, library })
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
})

setupListeners(store.dispatch)

let lastVolume = parseInt(localStorage.getItem('localVolume') || '100')
store.subscribe(() => {
  const currentVolume = getVolume(store.getState())
  if (currentVolume !== lastVolume) {
    lastVolume = currentVolume
    localStorage.setItem('localVolume', lastVolume.toString(10))
  }
})
store.dispatch(setVolume(lastVolume))

export type AppDispatch = typeof store.dispatch
export type AppThunk<T> = (dispatch: AppDispatch, getState: () => RootState) => T
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
export type RootState = ReturnType<typeof rootReducer>
