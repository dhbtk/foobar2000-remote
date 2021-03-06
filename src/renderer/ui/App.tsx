import React, { useMemo } from 'react'
import { createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core'
import UiToolbar from './UiToolbar/UiToolbar'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store'
import MediaSessionState from './MediaSessionState/MediaSessionState'
import PlaylistView from './PlaylistView/PlaylistView'
import { MediaLibrary } from './MediaLibrary/MediaLibrary'
import StatusBar from './StatusBar/StatusBar'
import PlayerState from './state/PlayerState'

export const themeColors = {
  primary: '#8c82fc',
  secondary: '#ff9de2',
  divider: 'rgba(0, 0, 0, .12)'
}

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(() => createMuiTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      fontSize: 12
    },
    palette: {
      primary: {
        main: themeColors.primary
      },
      secondary: {
        main: themeColors.secondary
      },
      type: prefersDarkMode ? 'dark' : 'light'
    }
  }), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <PlayerState/>
      <UiToolbar/>
      <div style={{ flex: '1', display: 'flex', height: '0' }}>
        <MediaLibrary/>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <MediaSessionState/>
          <PlaylistView/>
        </div>
      </div>
      <StatusBar/>
    </ThemeProvider>
  )
}

export default App

export const start = (): void => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
