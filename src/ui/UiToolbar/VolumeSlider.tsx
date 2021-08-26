import React, { MouseEventHandler } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { getVolume } from '../../store/selectors'
import VolumeDownIcon from '@material-ui/icons/VolumeDown'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import { setVolume } from '../../store/local'
import { createStyles, Grid, makeStyles, Slider } from '@material-ui/core'

/*export default function VolumeSlider (): React.ReactElement {
  const volume = useAppSelector(getVolume)
  const dispatch = useAppDispatch()
  const volumeCoordinateX = Math.ceil((volume / 100) * 80)
  const volumeCoordinateY = Math.ceil(20 - (volume / 100) * 20)
  const volumePath = `m 0 20 L ${volumeCoordinateX} 20 L ${volumeCoordinateX} ${volumeCoordinateY} z`
  const onClick: MouseEventHandler<SVGSVGElement> = event => {
    const coord = event.clientX - event.currentTarget.getBoundingClientRect().left
    if (coord <= 2) {
      dispatch(setVolume(0))
    } else if (coord >= 75) {
      dispatch(setVolume(100))
    } else {
      dispatch(setVolume(Math.ceil((coord / 80) * 100)))
    }
  }

  return (
    <svg onClick={onClick} style={{ height: 20, width: 80, cursor: 'pointer', marginLeft: '8px', marginRight: '16px' }} version="1" viewBox="0 0 80 20">
      <path
        strokeWidth={1}
        fill="#cccccc"
        stroke="#cccccc"
        d={volumePath}
      />
      <path
        strokeWidth={1}
        fill="none"
        stroke="#ffffff"
        d="m 0 20 L 80 20 L 80 0 z"
      />
    </svg>
  )
}*/

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    width: 100,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    alignItems: 'center'
  },
  slider: {
    marginRight: theme.spacing(1.5),
    flex: '1',
    color: theme.palette.primary.contrastText
  }
}))

export default function VolumeSlider (): React.ReactElement {
  const classes = useStyles()
  const volume = useAppSelector(getVolume)
  const dispatch = useAppDispatch()
  const changeVolume = (_: unknown, n: number | number[]) => {
    dispatch(setVolume(n as number))
  }
  return (
    <div className={classes.root}>
      <Slider className={classes.slider} color="secondary" min={0} max={100} value={volume} onChange={changeVolume}/>
      {volume < 1 && <VolumeOffIcon/>}
      {volume >= 1 && volume < 75 && <VolumeDownIcon/>}
      {volume >= 75 && <VolumeUpIcon/>}
    </div>
  )
}

