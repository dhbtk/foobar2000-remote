import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  createStyles,
  makeStyles, Toolbar,
  Typography
} from '@material-ui/core'
import { useAppDispatch, useAppSelector } from '../../store'
import { getAlbumIds, getScanStatus } from '../../store/selectors'
import { loadAlbums, rescanLibrary } from '../../store/library'
import { AlbumList } from './AlbumList'

const useStyles = makeStyles((theme) => createStyles({
  root: {
    resize: 'horizontal',
    padding: 0,
    flex: '0 0 auto',
    height: '100%',
    position: 'relative',
  },
  resizeHandle: {
    position: 'absolute',
    content: '" "',
    top: 0,
    bottom: 0,
    right: 0,
    width: 2,
    backgroundColor: theme.palette.divider,
    cursor: 'ew-resize'
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
  const containerRef = useRef<HTMLDivElement>()
  const [height, setHeight] = useState(0)
  useEffect(() => {
    const handler = () => {
      setHeight(containerRef.current.clientHeight - 48)
    }
    window.addEventListener('resize', handler)
    handler()
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  const [width, setWidth] = useState(400)
  const widthRef = useRef(width)
  widthRef.current = width

  const startResize = useCallback<MouseEventHandler<HTMLDivElement>>((startEv) => {
    let x: number, dx: number
    x = startEv.screenX
    const moveHandler = (e: MouseEvent) => {
      dx = e.screenX - x
      x = e.screenX
      widthRef.current += dx
      setWidth(widthRef.current)
    }
    const stopDrag = () => {
      document.body.removeEventListener('mousemove', moveHandler)
      document.body.removeEventListener('mouseup', stopDrag)
    }
    document.body.addEventListener('mousemove', moveHandler)
    document.body.addEventListener('mouseup', stopDrag)
  }, [setWidth])
  return (
    <div className={classes.root} ref={containerRef} style={{ width }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography>
            {`All music (${albumIds.length})`}
          </Typography>
          <Button onClick={refreshLibrary} disabled={syncing} variant="contained" style={{ marginLeft: 'auto' }}>
            Refresh
          </Button>
        </Toolbar>
      </AppBar>
      {syncing && <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', alignItems: 'center' }}>
        <CircularProgressWithLabel value={percentLoaded} />
        <Typography>
          Loading: {scanned} of {totalSongs}
        </Typography>
      </div>}
      {!syncing && <AlbumList height={height} width={width - 2} />}
      <div className={classes.resizeHandle} onMouseDown={startResize} />
    </div>
  )
}
