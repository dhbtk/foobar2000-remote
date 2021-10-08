import React, { CSSProperties } from 'react'
import { getAlbumForDisplay, getMediaLibraryList, getMediaLibraryRow, LibraryRow } from '../../store/selectors'
import { createStyles, makeStyles } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleAlbumOpen } from '../../store/library'
import { FixedSizeList } from 'react-window'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import api from '../../api/api'

const useStyles = makeStyles((theme) => createStyles({
  list: {
    position: 'relative'
  },
  slot: {
    margin: 0,
    padding: 0,
    height: 18,
    maxHeight: 18,
    overflow: 'hidden',
    transition: 'height 125ms ease-in-out',
    display: 'flex'
  },
  hidden: {
    height: 0
  },
  toggle: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 6,
    height: 18,
    width: 12,
    minWidth: 12,
    fontSize: 18
  },
  childIndicator: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 12,
    height: 12,
    width: 12,
    minWidth: 12,
    fontSize: 12
  },
  text: {
    ...theme.typography.body1,
    fontSize: 12,
    flex: '1',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: 'default',
    userSelect: 'none'
  }
}))

const AlbumRow: React.FC<{ index: number, data: LibraryRow, style: CSSProperties }> = ({ index, style }) => {
  const dispatch = useAppDispatch()
  const item: LibraryRow = useAppSelector(state => getMediaLibraryRow(state, index))
  const displayItem = useAppSelector(state => getAlbumForDisplay(state, ('albumId' in item) ? item.albumId : item.id))
  const defaultPlaylistId = useAppSelector(state => state.player.playlists[0]?.id ?? '')
  const sendToDefault = () => {
    console.log('kaboom!!!!', defaultPlaylistId)
    if (defaultPlaylistId !== '') {
      console.log('happening<SSS')
      api.replaceEntries(defaultPlaylistId, displayItem.songs.map(s => s.path))
    }
  }
  const classes = useStyles()
  if ('albumId' in item) {
    return (
      <div style={style} className={classes.slot}>
        <div className={classes.childIndicator}/>
        <span className={classes.text} title={`${item.trackNumber}. ${item.title}`}>
          {item.trackNumber}. {item.title}
        </span>
      </div>
    )
  } else {
    return (
      <div style={style} className={classes.slot} onDoubleClick={sendToDefault}>
        <div className={classes.toggle} onClick={() => dispatch(toggleAlbumOpen(item.id))}>
          {item.visible ? <KeyboardArrowDownIcon fontSize="inherit"/> : <KeyboardArrowRightIcon fontSize="inherit"/>}
        </div>
        <span className={classes.text} title={`${item.artist} - [${item.date}] ${item.album} (${item.songIds.length})`}>
          {item.artist} - [{item.date}] {item.album} ({item.songIds.length})
        </span>
      </div>
    )
  }
}

export const AlbumList: React.FC<{ width: number, height: number }> = ({ width, height }) => {
  const albums = useAppSelector(getMediaLibraryList)

  return (
    <FixedSizeList itemSize={18} height={height} itemCount={albums.length} width={width} overscanCount={30}>
      {AlbumRow}
    </FixedSizeList>
  )
}
