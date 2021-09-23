import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../store'
import { getPlayerState } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { Slider } from '@material-ui/core'
import api from '../../api/api'

export default function ProgressSlider (): React.ReactElement {
  const playerState = useAppSelector(getPlayerState, shallowEqual)
  const { duration, position } = playerState.activeItem
  const [ourDuration, setOurDuration] = useState(duration)
  const [ourPosition, setOurPosition] = useState(position)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    if (!isLoading) {
      setOurDuration(duration)
    }
  }, [duration])
  useEffect(() => {
    if (!isLoading) {
      setOurPosition(position)
    }
  }, [position])
  const seekPosition = (_: unknown, n: number | number[]) => {
    if (typeof n === 'number') {
      if (!isLoading) {
        setLoading(true)
        setOurPosition(n)
        api.seek(n).then(() => setLoading(false), () => setLoading(false))
      }
    }
  }

  return <Slider min={0} max={ourDuration} value={ourPosition} onChange={seekPosition} color="secondary" />
}
