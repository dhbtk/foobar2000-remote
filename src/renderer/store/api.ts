import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'
import { columns } from '../api/api'
import { Player, PlaylistInfo, PlaylistItemList } from '../../shared/types'
import { apiUrl } from '../api/apiUrl'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ['Playlist'],
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
      transformResponse: (response: { playlistItems: PlaylistItemList }) => response.playlistItems,
      providesTags: (_result, _err, { id }) => [{ type: 'Playlist', id }]
    }),
    replaceEntries: build.mutation<void, { playlistId: string, items: string[] }>({
      query ({ playlistId, items }) {
        return {
          url: `playlists/${playlistId}/items/add`,
          method: 'POST',
          body: {
            index: 0,
            async: false,
            replace: true,
            play: true,
            items
          }
        }
      },
      invalidatesTags: (_r, _e, { playlistId: id }) => [{ type: 'Playlist', id }]
    })
  })
})

export const {
  useGetPlayerQuery,
  useGetPlaylistsQuery,
  useGetPlaylistItemsQuery,
  useReplaceEntriesMutation
} = api
