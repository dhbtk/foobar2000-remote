import { BrowseItem } from '../../upnp/renderer'

type Migration = (db: Database) => Promise<void>

export interface Song {
  rowid: number
  path: string
  title: string
  creator: string
  date: string
  artist: string
  album: string
  duration: string
  track_number: string
}

export interface Album {
  artist: string
  album: string
  date: string
  songs: number
}

const migrations: Array<Migration> = [
  (db) => {
    return new Promise((resolve) => {
      db.transaction(
        (tx) => {
          tx.executeSql('CREATE TABLE IF NOT EXISTS songs (path text not null, title text, creator text, date text, artist text, album text, duration text, track_number text)')
        },
        null,
        () => resolve()
      )
    })
  },
  (db) => {
    return new Promise((resolve) => {
      db.transaction(
        (tx) => {
          tx.executeSql(`CREATE VIEW IF NOT EXISTS albums AS
SELECT artist, album, date, count(*) AS songs FROM songs GROUP BY 1, 2, 3`)
        },
        null,
        () => resolve()
      )
    })
  }
]

let migrated = false

export async function getDatabase (): Promise<DatabaseWrapper> {
  const instance = new DatabaseWrapper()
  await instance.migrate()
  return instance
}

export class DatabaseWrapper {
  private readonly database: Database

  constructor () {
    this.database = window.openDatabase('library', '1.0', 'Remote media library cache', 10 * 1024 * 1024)
  }

  async getAlbums (): Promise<Array<Album>> {
    return await this.select('SELECT * FROM albums ORDER BY artist, date, album')
  }

  async clearSongs (): Promise<void> {
    await this.query('DELETE FROM songs')
  }

  async insertSong (path: string, itemInfo: BrowseItem): Promise<void> {
    const sql = `
    INSERT INTO songs (path, title, creator, date, artist, album, duration, track_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
    await this.query(sql, [path, itemInfo.title, itemInfo.creator, itemInfo.date, itemInfo.artist, itemInfo.album, itemInfo.durations[0], itemInfo.trackNumber])
  }

  async migrate (): Promise<void> {
    if (!migrated) {
      for (const migration of migrations) {
        await migration(this.database)
      }
      migrated = true
    }
  }

  async query (sql: string, args: string[] = []): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(sql, args, (_, rs) => resolve(rs), e => {
          reject(e)
          return false
        })
      })
    })
  }

  async select <T> (sql: string, args: string[] = []): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(sql, args, (_, results) => {
          resolve(Array.from({ length: results.rows.length}).map((__, i) => results.rows.item(i)))
        }, e => {
          reject(e)
          return false
        })
      })
    })
  }
}
