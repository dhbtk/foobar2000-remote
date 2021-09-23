import React, { useEffect } from 'react'
import store, { useAppDispatch } from '../../store'
import { setCurrentPosition } from '../../store/player'
import MetadataState from './MetadataState'
import StateStream from './StateStream'
import StreamPlayer from './StreamPlayer'
import { getPlaybackState } from '../../store/selectors'

const stream = new StateStream()

export default function PlayerState (): React.ReactElement {
  const dispatch = useAppDispatch()
  useEffect(() => {
    stream.start()
    const interval = setInterval(() => {
      if (getPlaybackState(store.getState()) === 'playing') {
        dispatch(setCurrentPosition(new Date().getTime()))
      }
    }, 1000)
    return () => {
      stream.stop()
      clearInterval(interval)
    }
  }, [])
  return (
    <React.Fragment>
      <StreamPlayer/>
      <MetadataState/>
    </React.Fragment>
  )
}
