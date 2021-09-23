export interface Song {
  id: number
  path: string
  title: string
  creator: string
  date: string
  artist: string
  album: string
  duration: string
  trackNumber: string
}

export interface Album {
  id: number
  artist: string
  album: string
  date: string
  songIds: number[]
}
