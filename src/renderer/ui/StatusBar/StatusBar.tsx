import React from 'react'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { useAppSelector } from '../../store'
import { getMetadata, getPlaybackState, getPlayerState } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { ms } from '../utils'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 24,
    height: 24,
    borderTop: '1px solid #ddd',
    paddingLeft: theme.spacing(2)
  }
}))

export default function StatusBar (): React.ReactElement {
  const classes = useStyles()
  const metadata = useAppSelector(getMetadata, shallowEqual)
  const { codec, bitrate, sampleRate, channels } = metadata?.itemInfo || {}
  const playbackState = useAppSelector(getPlaybackState)
  const playerState = useAppSelector(getPlayerState, shallowEqual)
  const { duration, position } = playerState.activeItem
  return (
    <Typography component="div" className={classes.root}>
      {playbackState === 'stopped' ? (
        'Playback stopped.'
      ) : (
        `${codec} | ${bitrate} kbps | ${sampleRate} Hz | ${channels} | ${ms(position)} / ${ms(duration)}`
      )}
    </Typography>
  )
}
