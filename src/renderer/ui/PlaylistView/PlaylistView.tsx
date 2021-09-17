import React, { useEffect, useState } from 'react'
import { AppBar, createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import { Playlist } from './Playlist'
import { useGetPlaylistsQuery } from '../../store/api'

const useStyles = makeStyles((_theme: Theme) => createStyles({
  root: {
    minHeight: 32,
    '& .MuiTab-root': {
      minHeight: 32
    }
  },
  playlistContainer: {
    flex: 1,
    height: 0,
    overflow: 'hidden',
    position: 'relative'
  }
}))

export default function PlaylistView (): React.ReactElement {
  const classes = useStyles()
  const [tabIndex, setTabIndex] = useState(0)
  const { data: playlists = [] } = useGetPlaylistsQuery({})
  const playlistNames = playlists?.map(p => p.title) ?? []
  const selectedPlaylistIndex = playlists?.find(p => p.isCurrent)?.index ?? 0
  useEffect(() => setTabIndex(selectedPlaylistIndex), [selectedPlaylistIndex])

  return (
    <React.Fragment>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIndex}
          className={classes.root}
          onChange={(_, i) => setTabIndex(i)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {playlistNames.map(name => <Tab key={name} label={name} />)}
        </Tabs>
      </AppBar>
      <div className={classes.playlistContainer}>
        {playlists.map((_, i) => <Playlist activeIndex={tabIndex} index={i} key={i}/>)}
      </div>
    </React.Fragment>
  )
}
