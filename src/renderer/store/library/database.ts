import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { BrowseItem } from '../../upnp/client'
import { Album, Song } from './types'

const DB = 'songDB'

interface SongDB extends DBSchema {
  songs: {
    key: number
    value: Omit<Song, 'id'>
    indexes: {
      'by-album': string[]
      'by-path': string
      'by-trackNumber': string
    }
  }
  albums: {
    key: number
    value: Omit<Album, 'id'>
    indexes: {
      'by-name': string[]
    }
  }
}

export async function getDB (): Promise<IDBPDatabase<SongDB>> {
  return await openDB<SongDB>(DB, 5, {
    upgrade: async (db, oldVersion, _newVersion, tx) => {
      if (oldVersion < 1) {
        const songStore = db.createObjectStore('songs', {
          keyPath: 'id',
          autoIncrement: true
        })
        songStore.createIndex('by-album', ['artist', 'album', 'date'], {
          unique: false
        })
        const albumStore = db.createObjectStore('albums', {
          keyPath: 'id',
          autoIncrement: true
        })
        albumStore.createIndex('by-name', ['artist', 'date', 'album'], {
          unique: false
        })
      }
      if (oldVersion < 2) {
        tx.objectStore('songs').deleteIndex('by-album')
        tx.objectStore('songs').createIndex('by-album', ['artist', 'date', 'album'], {
          unique: false
        })
      }
      if (oldVersion < 3) {
        tx.objectStore('albums').deleteIndex('by-name')
        tx.objectStore('albums').createIndex('by-name', ['artist', 'date', 'album'], {
          unique: true
        })
      }
      if (oldVersion < 4) {
        tx.objectStore('songs').createIndex('by-path', 'path', {
          unique: true
        })
      }
      if (oldVersion < 5) {
        tx.objectStore('songs').createIndex('by-trackNumber', 'trackNumber', {
          unique: false
        })
      }
    }
  })
}

export async function syncAlbums (): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['songs', 'albums'], 'readwrite')
  const albumIndex = tx.objectStore('albums').index('by-name')
  let songsCursor = await tx.objectStore('songs').index('by-album').openCursor()
  while (songsCursor) {
    const { key, value } = songsCursor
    const song = value as Song
    const possibleAlbum = (await albumIndex.get(key)) as Album | undefined
    if (possibleAlbum !== undefined) {
      if (!possibleAlbum.songIds.includes(song.id)) {
        possibleAlbum.songIds.push(song.id)
        await tx.objectStore('albums').put(possibleAlbum)
      }
    } else {
      const newAlbum = {
        artist: song.artist,
        album: song.album,
        date: song.date,
        songIds: [song.id]
      }
      await tx.objectStore('albums').put(newAlbum)
    }
    songsCursor = await songsCursor.continue()
  }
}

export async function getAlbums (): Promise<Album[]> {
  const db = await getDB()
  const tx = db.transaction('albums', 'readonly')

  return (await tx.store.index('by-name').getAll()) as Album[]
}

export async function getSongs (): Promise<Song[]> {
  const db = await getDB()
  const tx = db.transaction('songs', 'readonly')

  return (await tx.store.index('by-trackNumber').getAll()) as Song[]
}

export async function clearSongs (): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['songs', 'albums'], 'readwrite')
  await tx.objectStore('songs').clear()
  await tx.objectStore('albums').clear()
}

export async function songExists (path: string): Promise<boolean> {
  const db = await getDB()
  const tx = db.transaction('songs')
  const song = await tx.objectStore('songs').index('by-path').getKey(path)
  return !!song
}

export async function insertSong (path: string, itemInfo: BrowseItem): Promise<void> {
  const { title, creator, date, artist, album, durations, trackNumber } = itemInfo
  const db = await getDB()
  const tx = db.transaction('songs', 'readwrite')
  await tx.store.add({
    path,
    title,
    creator,
    date,
    artist,
    album,
    duration: durations[0],
    trackNumber
  })
}
