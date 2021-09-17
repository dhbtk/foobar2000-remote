import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  createStyles,
  makeStyles,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TreeItem, TreeView } from '@material-ui/lab'
import { rescan } from '../../library/libraryScanner'
import { Album, getDatabase } from '../../library/DatabaseWrapper'

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: 400,
    resize: 'horizontal',
    padding: theme.spacing(1),
    borderRight: '1px solid #ccc',
    flex: '0 0 auto',
    height: '100%',
    overflow: 'auto'
  },
  small: {
    '& .MuiTreeItem-label': {
      fontSize: '0.75rem'
    }
  }
}))

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const MediaLibrary: React.FC = () => {
  const classes = useStyles()
  const [albums, setAlbums] = useState<Array<Album>>([])
  const [totalLoading, setTotalLoading] = useState(1)
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    getDatabase().then(db => db.getAlbums()).then(albums => setAlbums(albums))
  }, [])
  const callback = (loaded: number, total: number) => {
    setTotalLoading(total)
    setTotalLoaded(loaded)
  }
  const refreshLibrary = async () => {
    setLoading(true)
    await rescan(callback)
    const db = await getDatabase()
    setAlbums(await db.getAlbums())
    setLoading(false)
  }
  const percentLoaded = Math.round((totalLoaded / totalLoading) * 100)
  return (
    <div className={classes.root}>
      <div style={{ display: 'flex' }}>
        <Typography>{`All music (${albums.length})`}</Typography>
        <Button onClick={refreshLibrary} disabled={isLoading} variant="contained" style={{ marginLeft: 'auto' }}>
          Refresh
        </Button>
      </div>
      {isLoading && <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', alignItems: 'center' }}>
        <CircularProgressWithLabel value={percentLoaded} />
        <Typography>
          Loading: {totalLoaded} of {totalLoading}
        </Typography>
      </div>}
      {!isLoading && <TreeView
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
      >
        {albums.map((album, albumIndex) => (
          <TreeItem
            className={classes.small}
            key={albumIndex}
            nodeId={`A${albumIndex}`}
            label={`${album.artist} - [${album.date}] ${album.album} (${album.songs})`}
          />
        ))}
      </TreeView>}
    </div>
  )
}
