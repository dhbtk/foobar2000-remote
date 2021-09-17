import React, { useEffect } from 'react'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { useAppSelector } from '../../store'
import { getActiveItem, getPlaylist } from '../../store/selectors'
import { useGetPlaylistItemsQuery } from '../../store/api'
import { PlaylistItemList } from '../../../shared/types'
import api, { columnInfo } from '../../api/api'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

const useStyles = makeStyles((theme: Theme) => createStyles({
  '@media (prefers-color-scheme: dark)': {
    root: {
      background: '#474280'
    },
    playlistRow: {
      '&:nth-of-type(2n)': {
        background: '#804f73'
      }
    },
    albumTitle: {
      color: '#f6f5fc'
    }
  },
  '@media (prefers-color-scheme: light)': {
    root: {
      background: '#f6f5fc'
    },
    playlistRow: {
      '&:nth-of-type(2n)': {
        background: '#f1f0fc'
      }
    },
    albumTitle: {
      color: '#7f76e3'
    }
  },
  root: {
    paddingTop: theme.spacing(1),
    overflow: 'auto',
    height: '100%',
    width: '100%',
    position: 'absolute',
    transition: 'transform ease-in-out 0.25s',
    transform: 'translateX(0)'
  },
  playlistRow: {
    display: 'flex',
    paddingBottom: theme.spacing(0.5),
    alignItems: 'center',
    cursor: 'default'
  },
  albumTitle: {
    marginLeft: theme.spacing(1.5)
  },
  fixedWidth: {
    width: '50px',
    textAlign: 'right',
    paddingRight: theme.spacing(1)
  }
}))

const PlaylistItems: React.FC<{ playlistId: string, playlistItems: PlaylistItemList }> = React.memo(({ playlistId, playlistItems }) => {
  const items = playlistItems.items.map(i => columnInfo(i.columns))
  const classes = useStyles()
  const nowPlaying = useAppSelector(getActiveItem)
  const isActivePlaylist = playlistId === nowPlaying.playlistId
  const nowPlayingId = nowPlaying.index
  useEffect(() => {
    if (isActivePlaylist) {
      window.document.getElementById(`item-${playlistId}-${nowPlayingId}`)?.scrollIntoView({
        block: 'center'
      })
    }
  }, [nowPlayingId, isActivePlaylist])
  return (
    <React.Fragment>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {(index === 0 || items[index - 1].album !== item.album) && (
            <Typography component="h5" variant="subtitle1" className={classes.albumTitle}>
              {item.artist} - [{item.date}] {item.album}
            </Typography>
          )}
          <div className={classes.playlistRow} id={`item-${playlistId}-${index}`} onDoubleClick={() => api.playItem(playlistId, index)}>
            <PlayArrowIcon style={{ visibility: isActivePlaylist && index === nowPlaying.index ? 'visible' : 'hidden' }} />
            <span className={classes.fixedWidth}>
              {item.discNumber !== '?' ? (`${item.discNumber}.${item.trackNumber}`) : item.trackNumber}
            </span>
            <span style={{ flex: '1' }}>{item.title}</span>
            <span className={classes.fixedWidth}>{item.length}</span>
          </div>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
})

const transform = (index: number, activeIndex: number) => {
  if (index === activeIndex) {
    return 'translateX(0)'
  } else if (index > activeIndex) {
    return 'translateX(100%)'
  } else {
    return 'translateX(-100%)'
  }
}

export const Playlist: React.FC<{ index: number, activeIndex: number }> = ({ index, activeIndex }) => {
  const classes = useStyles()
  const playlist = useAppSelector(getPlaylist(index))
  const { data: playlistItems } = useGetPlaylistItemsQuery({ id: playlist?.id, range: `0:${playlist?.itemCount}`})
  const style = {
    transform: transform(index, activeIndex)
  }
  return (
    <div className={classes.root} style={style}>
      {playlistItems ? <PlaylistItems playlistId={playlist.id} playlistItems={playlistItems}/> : 'Loading...'}
    </div>
  )
}
