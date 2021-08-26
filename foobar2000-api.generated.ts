import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "//localhost:8880/api" }),
  tagTypes: [],
  endpoints: (build) => ({
    getPlayerState: build.query<
      GetPlayerStateApiResponse,
      GetPlayerStateApiArg
    >({
      query: (queryArg) => ({
        url: `/player`,
        params: { columns: queryArg.columns },
      }),
    }),
    setPlayerState: build.mutation<
      SetPlayerStateApiResponse,
      SetPlayerStateApiArg
    >({
      query: (queryArg) => ({
        url: `/player`,
        method: "POST",
        params: {
          volume: queryArg.volume,
          isMuted: queryArg.isMuted,
          position: queryArg.position,
          relativePosition: queryArg.relativePosition,
          playbackMode: queryArg.playbackMode,
        },
      }),
    }),
    playCurrent: build.mutation<PlayCurrentApiResponse, PlayCurrentApiArg>({
      query: () => ({ url: `/player/play`, method: "POST" }),
    }),
    playItem: build.mutation<PlayItemApiResponse, PlayItemApiArg>({
      query: (queryArg) => ({
        url: `/player/play/${queryArg.playlistId}/${queryArg.index}`,
        method: "POST",
      }),
    }),
    playRandom: build.mutation<PlayRandomApiResponse, PlayRandomApiArg>({
      query: () => ({ url: `/player/play/random`, method: "POST" }),
    }),
    playNext: build.mutation<PlayNextApiResponse, PlayNextApiArg>({
      query: (queryArg) => ({
        url: `/player/next`,
        method: "POST",
        params: { by: queryArg.by },
      }),
    }),
    playPrevious: build.mutation<PlayPreviousApiResponse, PlayPreviousApiArg>({
      query: (queryArg) => ({
        url: `/player/previous`,
        method: "POST",
        params: { by: queryArg.by },
      }),
    }),
    stop: build.mutation<StopApiResponse, StopApiArg>({
      query: () => ({ url: `/player/stop`, method: "POST" }),
    }),
    pause: build.mutation<PauseApiResponse, PauseApiArg>({
      query: () => ({ url: `/player/pause`, method: "POST" }),
    }),
    togglePause: build.mutation<TogglePauseApiResponse, TogglePauseApiArg>({
      query: () => ({ url: `/player/pause/toggle`, method: "POST" }),
    }),
    getPlaylists: build.query<GetPlaylistsApiResponse, GetPlaylistsApiArg>({
      query: () => ({ url: `/playlists` }),
    }),
    updatePlaylists: build.mutation<
      UpdatePlaylistsApiResponse,
      UpdatePlaylistsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists`,
        method: "POST",
        params: { current: queryArg.current },
      }),
    }),
    addPlaylist: build.mutation<AddPlaylistApiResponse, AddPlaylistApiArg>({
      query: (queryArg) => ({
        url: `/playlists/add`,
        method: "POST",
        params: { index: queryArg.index, title: queryArg.title },
      }),
    }),
    removePlaylist: build.mutation<
      RemovePlaylistApiResponse,
      RemovePlaylistApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/remove/${queryArg.playlistId}`,
        method: "POST",
      }),
    }),
    movePlaylist: build.mutation<MovePlaylistApiResponse, MovePlaylistApiArg>({
      query: (queryArg) => ({
        url: `/playlists/move/${queryArg.playlistId}/${queryArg.index}`,
        method: "POST",
      }),
    }),
    getPlaylistItems: build.query<
      GetPlaylistItemsApiResponse,
      GetPlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/${queryArg.range}`,
        params: { columns: queryArg.columns },
      }),
    }),
    updatePlaylist: build.mutation<
      UpdatePlaylistApiResponse,
      UpdatePlaylistApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}`,
        method: "POST",
        params: { title: queryArg.title },
      }),
    }),
    clearPlaylist: build.mutation<
      ClearPlaylistApiResponse,
      ClearPlaylistApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/clear`,
        method: "POST",
      }),
    }),
    addPlaylistItems: build.mutation<
      AddPlaylistItemsApiResponse,
      AddPlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/add`,
        method: "POST",
        body: queryArg.addItemsRequest,
      }),
    }),
    copyPlaylistItems: build.mutation<
      CopyPlaylistItemsApiResponse,
      CopyPlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/copy`,
        method: "POST",
        body: queryArg.itemIndexesRequest,
        params: { targetIndex: queryArg.targetIndex },
      }),
    }),
    copyPlaylistItemsEx: build.mutation<
      CopyPlaylistItemsExApiResponse,
      CopyPlaylistItemsExApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.sourceId}/${queryArg.targetId}/items/copy`,
        method: "POST",
        body: queryArg.itemIndexesRequest,
        params: { targetIndex: queryArg.targetIndex },
      }),
    }),
    movePlaylistItems: build.mutation<
      MovePlaylistItemsApiResponse,
      MovePlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/move`,
        method: "POST",
        body: queryArg.itemIndexesRequest,
        params: { targetIndex: queryArg.targetIndex },
      }),
    }),
    movePlaylistItemsEx: build.mutation<
      MovePlaylistItemsExApiResponse,
      MovePlaylistItemsExApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.sourceId}/${queryArg.targetId}/items/move`,
        method: "POST",
        body: queryArg.itemIndexesRequest,
        params: { targetIndex: queryArg.targetIndex },
      }),
    }),
    removePlaylistItems: build.mutation<
      RemovePlaylistItemsApiResponse,
      RemovePlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/remove`,
        method: "POST",
        body: queryArg.itemIndexesRequest,
      }),
    }),
    sortPlaylistItems: build.mutation<
      SortPlaylistItemsApiResponse,
      SortPlaylistItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/playlists/${queryArg.playlistId}/items/sort`,
        method: "POST",
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          random: queryArg.random,
        },
      }),
    }),
    query: build.query<QueryApiResponse, QueryApiArg>({
      query: (queryArg) => ({
        url: `/query`,
        params: {
          player: queryArg.player,
          trcolumns: queryArg.trcolumns,
          playlists: queryArg.playlists,
          playlistItems: queryArg.playlistItems,
          plref: queryArg.plref,
          plrange: queryArg.plrange,
          plcolumns: queryArg.plcolumns,
        },
      }),
    }),
    getFsRoots: build.query<GetFsRootsApiResponse, GetFsRootsApiArg>({
      query: () => ({ url: `/browser/roots` }),
    }),
    getFsEntries: build.query<GetFsEntriesApiResponse, GetFsEntriesApiArg>({
      query: (queryArg) => ({
        url: `/browser/entries`,
        params: { path: queryArg.path },
      }),
    }),
    getArtwork: build.query<GetArtworkApiResponse, GetArtworkApiArg>({
      query: (queryArg) => ({
        url: `/artwork/${queryArg.playlistId}/${queryArg.index}`,
      }),
    }),
  }),
});
export type GetPlayerStateApiResponse = /** status 200 Success */ {
  player?: PlayerState;
};
export type GetPlayerStateApiArg = {
  /** Active item columns to return */
  columns?: string[];
};
export type SetPlayerStateApiResponse = unknown;
export type SetPlayerStateApiArg = {
  /** New volume value */
  volume?: number;
  /** New mute state */
  isMuted?: boolean;
  /** New absolute playback position (seconds) */
  position?: number;
  /** New relative playback position (seconds) */
  relativePosition?: number;
  /** New playback mode index */
  playbackMode?: number;
};
export type PlayCurrentApiResponse = unknown;
export type PlayCurrentApiArg = {};
export type PlayItemApiResponse = unknown;
export type PlayItemApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Item index */
  index: string;
};
export type PlayRandomApiResponse = unknown;
export type PlayRandomApiArg = {};
export type PlayNextApiResponse = unknown;
export type PlayNextApiArg = {
  /** Expression to select next item by (e.g. %artist%). */
  by?: string;
};
export type PlayPreviousApiResponse = unknown;
export type PlayPreviousApiArg = {
  /** Expression to select previous item by (e.g. %artist%). */
  by?: string;
};
export type StopApiResponse = unknown;
export type StopApiArg = {};
export type PauseApiResponse = unknown;
export type PauseApiArg = {};
export type TogglePauseApiResponse = unknown;
export type TogglePauseApiArg = {};
export type GetPlaylistsApiResponse = /** status 200 Success */ {
  playlists?: PlaylistsResult;
};
export type GetPlaylistsApiArg = {};
export type UpdatePlaylistsApiResponse = unknown;
export type UpdatePlaylistsApiArg = {
  /** Playlist id or index to make current */
  current?: string;
};
export type AddPlaylistApiResponse = unknown;
export type AddPlaylistApiArg = {
  /** Position to add playlist at. By default playlist is added to the last position */
  index?: number;
  /** New playlist title */
  title?: string;
};
export type RemovePlaylistApiResponse = unknown;
export type RemovePlaylistApiArg = {
  /** Playlist id or index */
  playlistId: string;
};
export type MovePlaylistApiResponse = unknown;
export type MovePlaylistApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Target position. Use negative value to move to the last position */
  index: string;
};
export type GetPlaylistItemsApiResponse = /** status 200 Success */ {
  playlistItems?: PlaylistItemsResult;
};
export type GetPlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Playlist item range in form offset:count */
  range: string;
  /** Item columns to return */
  columns: string[];
};
export type UpdatePlaylistApiResponse = unknown;
export type UpdatePlaylistApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** New playlist title */
  title?: string;
};
export type ClearPlaylistApiResponse = unknown;
export type ClearPlaylistApiArg = {
  /** Playlist id or index */
  playlistId: string;
};
export type AddPlaylistItemsApiResponse = unknown;
export type AddPlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Items to add */
  addItemsRequest: AddItemsRequest;
};
export type CopyPlaylistItemsApiResponse = unknown;
export type CopyPlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Position to copy items to. Items are copied to the end of the playlist by default */
  targetIndex?: number;
  /** Indexes of items to copy */
  itemIndexesRequest: ItemIndexesRequest;
};
export type CopyPlaylistItemsExApiResponse = unknown;
export type CopyPlaylistItemsExApiArg = {
  /** Source playlist id or index */
  sourceId: string;
  /** Target playlist id or index */
  targetId: string;
  /** Playlist position to copy items to. Items are copied to the end of the playlist by default */
  targetIndex?: number;
  /** Indexes of items to copy */
  itemIndexesRequest: ItemIndexesRequest;
};
export type MovePlaylistItemsApiResponse = unknown;
export type MovePlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Position to move items to. Items are moved to the end of the playlist by default */
  targetIndex?: number;
  /** Indexes of items to move */
  itemIndexesRequest: ItemIndexesRequest;
};
export type MovePlaylistItemsExApiResponse = unknown;
export type MovePlaylistItemsExApiArg = {
  /** Source playlist id or index */
  sourceId: string;
  /** Target playlist id or index */
  targetId: string;
  /** Position to move items to. Items are moved to the end of the playlist by default */
  targetIndex?: number;
  /** Indexes of items to move */
  itemIndexesRequest: ItemIndexesRequest;
};
export type RemovePlaylistItemsApiResponse = unknown;
export type RemovePlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Indexes of items to remove */
  itemIndexesRequest: ItemIndexesRequest;
};
export type SortPlaylistItemsApiResponse = unknown;
export type SortPlaylistItemsApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Expression to sort by (e.g. %title%) */
  by?: string;
  /** Sort in descending order */
  desc?: boolean;
  /** Sort randomly */
  random?: boolean;
};
export type QueryApiResponse = /** status 200 Success */ {
  player?: PlayerState;
  playlists?: PlaylistsResult;
  playlistItems?: PlaylistItemsResult;
};
export type QueryApiArg = {
  /** Request player state */
  player?: boolean;
  /** Active item columns to return */
  trcolumns?: string[];
  /** Request playlists */
  playlists?: boolean;
  /** Request playlist items */
  playlistItems?: boolean;
  /** Playlist id or index to return items from */
  plref?: string;
  /** Playlist range to return items from */
  plrange?: string;
  /** Playlist item columns to return */
  plcolumns?: string[];
};
export type GetFsRootsApiResponse = /** status 200 Success */ {
  pathSeparator?: string;
  roots?: FileSystemEntry[];
};
export type GetFsRootsApiArg = {};
export type GetFsEntriesApiResponse = /** status 200 Success */ {
  pathSeparator?: string;
  entries?: FileSystemEntry[];
};
export type GetFsEntriesApiArg = {
  /** Directory path */
  path?: string;
};
export type GetArtworkApiResponse = unknown;
export type GetArtworkApiArg = {
  /** Playlist id or index */
  playlistId: string;
  /** Item index */
  index: string;
};
export type PlayerInfo = {
  name?: string;
  title?: string;
  version?: string;
  pluginVersion?: string;
};
export type PlaybackState = "stopped" | "playing" | "paused";
export type VolumeType = "db" | "linear";
export type PlayerState = {
  info?: PlayerInfo;
  activeItem?: {
    playlistId?: string;
    playlistIndex?: number;
    index?: number;
    position?: number;
    duration?: number;
    columns?: string[];
  };
  playbackState?: PlaybackState;
  playbackMode?: number;
  playbackModes?: string[];
  volume?: {
    type?: VolumeType;
    min?: number;
    max?: number;
    value?: number;
    isMuted?: boolean;
  };
};
export type PlaylistInfo = {
  id?: string;
  index?: number;
  title?: string;
  isCurrent?: boolean;
  itemCount?: number;
  totalTime?: number;
};
export type PlaylistsResult = PlaylistInfo[];
export type PlaylistItemInfo = {
  columns?: string[];
};
export type PlaylistItemsResult = {
  offset?: number;
  totalCount?: number;
  items?: PlaylistItemInfo[];
};
export type AddItemsRequest = {
  index?: number;
  async?: boolean;
  replace?: boolean;
  play?: boolean;
  items?: string[];
};
export type ItemIndexesRequest = {
  items?: number[];
};
export type FileSystemEntry = {
  name?: string;
  path?: string;
  type?: "D" | "F";
  size?: number;
  timestamp?: number;
};
export const {
  useGetPlayerStateQuery,
  useSetPlayerStateMutation,
  usePlayCurrentMutation,
  usePlayItemMutation,
  usePlayRandomMutation,
  usePlayNextMutation,
  usePlayPreviousMutation,
  useStopMutation,
  usePauseMutation,
  useTogglePauseMutation,
  useGetPlaylistsQuery,
  useUpdatePlaylistsMutation,
  useAddPlaylistMutation,
  useRemovePlaylistMutation,
  useMovePlaylistMutation,
  useGetPlaylistItemsQuery,
  useUpdatePlaylistMutation,
  useClearPlaylistMutation,
  useAddPlaylistItemsMutation,
  useCopyPlaylistItemsMutation,
  useCopyPlaylistItemsExMutation,
  useMovePlaylistItemsMutation,
  useMovePlaylistItemsExMutation,
  useRemovePlaylistItemsMutation,
  useSortPlaylistItemsMutation,
  useQueryQuery,
  useGetFsRootsQuery,
  useGetFsEntriesQuery,
  useGetArtworkQuery,
} = api;

