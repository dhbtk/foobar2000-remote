import React from 'react'
import { useAppSelector } from '../../store'
import { getPlayerState } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { Slider } from '@material-ui/core'

export default function ProgressSlider (): React.ReactElement {
  const playerState = useAppSelector(getPlayerState, shallowEqual)
  const { duration, position } = playerState.activeItem

  return <Slider min={0} max={duration} value={position} color="secondary" />
}
