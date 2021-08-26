import React, { useEffect } from 'react'
import { useAppSelector } from '../../store'
import { getMediaImage, getMetadata, getNativeMetadata, getPlaybackState, getPlayerState } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { createStyles, makeStyles, Typography } from '@material-ui/core'
import api from '../../api/api'
import { setupRenderer, updateMetadata } from '../../stream/metadataRenderer'

const useStyles = makeStyles((theme) => createStyles({
  wrapper: {
    display: 'flex',
    minHeight: 128,
    height: 128,
    flexShrink: 0
  },
  image: {
    height: 128,
    width: 128,
    display: 'block',
    borderRight: '1px solid #ccc'
  },
  nowPlaying: {
    padding: theme.spacing(1)
  }
}))

const ms = (dur: number): string => {
  const fullSeconds = Math.floor(dur)
  const seconds = fullSeconds % 60
  const minutes = (fullSeconds - seconds) / 60
  const p1 = minutes < 10 ? '0' : ''
  const p2 = seconds < 10 ? '0' : ''

  return p1 + minutes + ':' + p2 + seconds
}

const MediaSessionState: React.FC = () => {
  const classes = useStyles()
  const playbackState = useAppSelector(getPlaybackState, shallowEqual)
  const metadata = useAppSelector(getMetadata, shallowEqual)
  const nativeMetadata = useAppSelector(getNativeMetadata, shallowEqual)
  useEffect(() => {
    setupRenderer()
  }, [])
  useEffect(() => {
    updateMetadata(nativeMetadata)
  }, [nativeMetadata])
  useEffect(() => {
    if (metadata === null) {
      //navigator.mediaSession.metadata = null
      window.document.title = 'foobar2000 remote'
    } else {
      //navigator.mediaSession.metadata = new MediaMetadata(metadata)
      window.document.title = `${metadata.artist} - [${metadata.album}] | ${metadata.title} [foobar2000 remote]`
    }
  }, [metadata])
  // useEffect(() => {
  //   if (playbackState === 'stopped') {
  //     navigator.mediaSession.playbackState = 'none'
  //   } else if (playbackState === 'paused') {
  //     navigator.mediaSession.playbackState = 'paused'
  //   } else {
  //     navigator.mediaSession.playbackState = 'playing'
  //   }
  //
  // }, [playbackState])
  // useEffect(() => {
  //   navigator.mediaSession.setActionHandler('play', () => api.play())
  //   navigator.mediaSession.setActionHandler('pause', () => api.pause())
  //   navigator.mediaSession.setActionHandler('stop', () => api.stop())
  //   navigator.mediaSession.setActionHandler('nexttrack', () => api.next())
  //   navigator.mediaSession.setActionHandler('previoustrack', () => api.previous())
  // }, [playbackState])

  const playerState = useAppSelector(getPlayerState, shallowEqual)
  const { duration, position } = playerState.activeItem
  const mediaImage = useAppSelector(getMediaImage, shallowEqual)
  useEffect(() => {
    // navigator.mediaSession.setPositionState({ duration, position, playbackRate: 1 })
  }, [duration, position])

  if (metadata === null) {
    return <div className={classes.wrapper} />
  } else {
    return (
      <div className={classes.wrapper}>
        <img alt="" src={mediaImage} className={classes.image} />
        <div className={classes.nowPlaying}>
          <Typography component="p" variant="body1">
            {metadata.artist}
          </Typography>
          <Typography component="p" variant="body1">
            {metadata.title}
          </Typography>
          <Typography component="p" variant="body1">
            {metadata.album}
          </Typography>
          <Typography component="p" variant="body1">
            {ms(position)} / {ms(duration)}
          </Typography>
        </div>
      </div>
    )
  }
}

export default MediaSessionState
