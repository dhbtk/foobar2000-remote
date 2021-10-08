import React, { useEffect } from 'react'
import { useAppSelector } from '../../store'
import { getPlaybackState, getVolume } from '../../store/selectors'
import { setGain, startListening, stopListening } from '../../stream/player'
import { shallowEqual } from 'react-redux'

export default function StreamPlayer (): React.ReactElement {
  const volume = useAppSelector(getVolume)
  const playbackState = useAppSelector(getPlaybackState, shallowEqual)
  const isListening = playbackState === 'playing'
  useEffect(() => {
    setGain(volume / 100)
  }, [volume])
  useEffect(() => {
    if (isListening) {
      startListening()
    } else {
      stopListening()
    }
  }, [isListening])

  return <React.Fragment/>
}

