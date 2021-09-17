import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'
import { apiUrl, columns } from '../api/api'
import { Player, PlaylistInfo, PlaylistItemList } from '../../shared/types'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (build) => ({
    getPlayer: build.query<Player, Record<string, never>>({
      query: () => ({ url: 'player', params: { columns: columns.join(',') } }),
      transformResponse: (response: { player: Player }) => response.player
    }),
    getPlaylists: build.query<PlaylistInfo[], Record<string, never>>({
      query: () => 'playlists',
      transformResponse: (response: { playlists: PlaylistInfo[] }) => response.playlists
    }),
    getPlaylistItems: build.query<PlaylistItemList, { id: string, range: string }>({
      query: ({ id, range }) => ({ url: `playlists/${id}/items/${range}`, params: { columns: columns.join(',') } }),
      transformResponse: (response: { playlistItems: PlaylistItemList }) => response.playlistItems
    })
  })
})

export const {
  useGetPlayerQuery,
  useGetPlaylistsQuery,
  useGetPlaylistItemsQuery
} = api
