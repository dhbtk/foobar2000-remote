import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { getVolume } from '../../store/selectors'
import VolumeDownIcon from '@material-ui/icons/VolumeDown'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import { setVolume } from '../../store/local'
import { createStyles, makeStyles, Slider } from '@material-ui/core'

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

