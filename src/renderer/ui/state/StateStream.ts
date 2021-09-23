import { apiUrl, columns } from '../../api/api'
import { QueryResponse } from '../../../shared/types'
import store from '../../store'
import { setPlayerInfo, setPlaylistsInfo } from '../../store/player'

export default class StateStream {
  private source: EventSource
  private resetTimeout: NodeJS.Timeout

  start (): void {
    const params = new URLSearchParams({
      player: 'true',
      playlists: 'true',
      trcolumns: columns.join(','),
    })
    this.source = new EventSource(`${apiUrl}/query/updates?${params}`)
    this.source.onmessage = (e) => this.onMessage(e)
    this.redefineTimeout()
  }

  redefineTimeout (): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
    }
    this.resetTimeout = setTimeout(() => {
      this.reconnect()
    }, 10000)
  }

  stop (): void {
    this.source.close()
  }

  reconnect (): void {
    this.stop()
    this.start()
  }

  onMessage (event: MessageEvent): void {
    this.redefineTimeout()
    const timestamp = new Date().getTime()
    const message: QueryResponse | Omit<QueryResponse, 'playlists'> = JSON.parse(event.data)
    if ('playlists' in message) {
      store.dispatch(setPlaylistsInfo({ playlists: message.playlists, timestamp }))
    }
    if ('player' in message) {
      store.dispatch(setPlayerInfo({ player: message.player, timestamp }))
    }
  }
}
