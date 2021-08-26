import React, { useEffect, useRef } from 'react'
import { useAppSelector } from '../../store'
import { getPlaybackState, getVolume } from '../../store/selectors'
import { setGain, startListening } from '../../stream/player'
import { shallowEqual } from 'react-redux'
import { streamUrl } from '../../api/api'

const useVbanStream = true

export default function StreamPlayer (): React.ReactElement {
  const volume = useAppSelector(getVolume)
  const audioRef = useRef<HTMLAudioElement>()
  const playbackState = useAppSelector(getPlaybackState, shallowEqual)
  const isListening = playbackState === 'playing'
  useEffect(() => {
    if (useVbanStream) {
      setGain(volume / 100)
    } else {
      if (audioRef.current) {
        audioRef.current.volume = volume / 100
      }
    }
  }, [volume])
  useEffect(() => {
    if (useVbanStream) {
      startListening()
    }
  }, [useVbanStream])

  if (useVbanStream || !isListening) {
    return <React.Fragment/>
  } else {
    return <audio ref={audioRef} autoPlay src={streamUrl} />
  }
}

