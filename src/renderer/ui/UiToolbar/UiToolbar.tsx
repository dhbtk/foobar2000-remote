import React, { useState } from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import api from '../../api/api'
import VolumeSlider from './VolumeSlider'
import ProgressSlider from './ProgressSlider'

const PromiseButton: React.FC<{ onClick: () => Promise<void>, edge?: 'start' | 'end'}> = ({onClick, children, edge}) => {
  const [disabled, setDisabled] = useState(false)
  const handler = () => {
    if (!disabled) {
      setDisabled(true)
      onClick().then(() => setDisabled(false)).catch((e) => {
        console.error(e)
        setDisabled(false)
      })
    }
  }
  return (
    <IconButton edge={edge || false} size="small" disabled={disabled} color="inherit" onClick={handler}>
      {children}
    </IconButton>
  )
}

export default function UiToolbar (): React.ReactElement {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" style={{ minHeight: 32 }}>
        <PromiseButton edge="start" onClick={api.stop}>
          <StopIcon/>
        </PromiseButton>
        <PromiseButton onClick={api.play}>
          <PlayArrowIcon/>
        </PromiseButton>
        <PromiseButton onClick={api.playPause}>
          <PauseIcon/>
        </PromiseButton>
        <PromiseButton onClick={api.previous}>
          <SkipPreviousIcon/>
        </PromiseButton>
        <PromiseButton onClick={api.next}>
          <SkipNextIcon/>
        </PromiseButton>
        <PromiseButton onClick={api.random}>
          <ShuffleIcon/>
        </PromiseButton>
        <VolumeSlider />
        <ProgressSlider />
      </Toolbar>
    </AppBar>
  )
}
