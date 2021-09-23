import React, { useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  createStyles,
  makeStyles,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { TreeItem, TreeView } from '@material-ui/lab'
import { useAppDispatch, useAppSelector } from '../../store'
import { getAlbumIds, getAlbumsForDisplay, getScanStatus } from '../../store/selectors'
import { loadAlbums, rescanLibrary } from '../../store/library'
import { AlbumList } from './AlbumList'

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
  const dispatch = useAppDispatch()
  const albumIds = useAppSelector(getAlbumIds)
  const { totalSongs, scanned, syncing } = useAppSelector(getScanStatus)
  useEffect(() => {
    dispatch(loadAlbums())
  }, [])
  const refreshLibrary = async () => {
    await dispatch(rescanLibrary(false))
  }
  const percentLoaded = totalSongs === 0 ? 0 : Math.round((scanned / totalSongs) * 100)
  return (
    <div className={classes.root}>
      <div style={{ display: 'flex' }}>
        <Typography>{`All music (${albumIds.length})`}</Typography>
        <Button onClick={refreshLibrary} disabled={syncing} variant="contained" style={{ marginLeft: 'auto' }}>
          Refresh
        </Button>
      </div>
      {syncing && <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', alignItems: 'center' }}>
        <CircularProgressWithLabel value={percentLoaded} />
        <Typography>
          Loading: {scanned} of {totalSongs}
        </Typography>
      </div>}
      {!syncing && <AlbumList albumIds={albumIds}/>}
    </div>
  )
}
