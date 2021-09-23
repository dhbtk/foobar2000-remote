import React, { useEffect, useState } from 'react'
import { AlbumWithSongs, getAlbumForDisplay, getAlbumsForDisplay } from '../../store/selectors'
import { createStyles, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleAlbumOpen } from '../../store/library'
import Tree, { renderers, Node } from 'react-virtualized-tree'

const { Expandable } = renderers

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
    marginLeft: 3,
    marginTop: 3,
    marginRight: 9,
    height: 12,
    width: 12,
    backgroundColor: '#900'
  },
  childIndicator: {
    marginLeft: 3,
    marginTop: 3,
    marginRight: 9,
    height: 12,
    width: 24,
    backgroundColor: '#900'
  }
}))

const AlbumRow: React.FC<{ albumId: number, visible: boolean }> = React.memo(({ albumId, visible }) => {
  const dispatch = useAppDispatch()
  const album = useAppSelector(state => getAlbumForDisplay(state, albumId))
  const classes = useStyles()
  const hidden = !visible
  return (
    <React.Fragment key={album.id}>
      <div className={classes.slot}>
        <div className={classes.toggle} onClick={() => dispatch(toggleAlbumOpen(album.id))}/>
        <Typography component="span" style={{ fontSize: 12 }}>
          {album.artist} - [{album.date}] {album.album} ({album.songIds.length})
        </Typography>
      </div>
      {album.songs.map(song => (
        <div className={clsx(classes.slot, hidden && classes.hidden)} key={song.id}>
          <div className={classes.childIndicator}/>
          <Typography component="span" style={{ fontSize: 12 }}>
            {song.trackNumber}. {song.title}
          </Typography>
        </div>
      ))}
    </React.Fragment>
  )
})

export const AlbumList: React.FC<{ albumIds: number[] }> = ({ albumIds }) => {
  const classes = useStyles()
  const albums = useAppSelector(getAlbumsForDisplay)
  const [albumNodes, setAlbumNodes] = useState<Node[]>([])
  useEffect(() => {
    setAlbumNodes(albums.map((album, albumIndex) => {
      return {
        id: `A${albumIndex}`,
        name: `${album.artist} - [${album.date}] ${album.album} (${album.songs.length})`,
        children: album.songs.map(song => ({
          id: `A${albumIndex}-${song.id}`,
          name: `${song.trackNumber}. ${song.title}`
        }))
      }
    }))
  }, [albums])

  return (
    <Tree nodes={albumNodes} onChange={setAlbumNodes}>
      {({ style, node, ...rest }) => {
        return (
          <div style={style}>
            <Expandable node={node} {...rest}>
              <Typography>{node.name}</Typography>
            </Expandable>
          </div>
        )
      }}
    </Tree>
  )
}
