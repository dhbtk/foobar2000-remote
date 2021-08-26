import React, { useEffect } from 'react'
import { useAppSelector } from '../../store'
import { getMediaImage, getMetadata, getNativeMetadata, getPlayerState } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { createStyles, makeStyles, Typography } from '@material-ui/core'
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
      window.document.title = 'foobar2000 remote'
    } else {
      window.document.title = `${metadata.artist} - [${metadata.album}] | ${metadata.title} [foobar2000 remote]`
    }
  }, [metadata])

  const playerState = useAppSelector(getPlayerState, shallowEqual)
  const { duration, position } = playerState.activeItem
  const mediaImage = useAppSelector(getMediaImage, shallowEqual)

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
