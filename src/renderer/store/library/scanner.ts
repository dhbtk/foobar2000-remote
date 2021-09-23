import upnpClient from '../../upnp/client'
import { clearSongs, insertSong, songExists, syncAlbums } from './database'

export async function rescan (progressCb: (progress: number, total: number) => void, reset = false): Promise<void> {
  const mediaLibraryId = await upnpClient.browse().then(xml => xml.container.find(c => c.title === 'Media Library').id)
  const foldersId = await upnpClient.browse(mediaLibraryId).then(xml => xml.container.find(c => c.title === 'All Files').id)

  await scanAllFiles(foldersId, progressCb, reset)
}

async function scanAllFiles (rootId: string, progressCb: (progress: number, total: number) => void, reset: boolean): Promise<void> {
  if (reset) {
    await clearSongs()
  }
  const allContents = await upnpClient.browse(rootId)
  const songCount = allContents.container.length
  let loggedSongs = 0

  for (const container of allContents.container) {
    const { id, title: path } = container
    const exists = await songExists(path)
    if (reset || !exists) {
      const songContent = await upnpClient.browse(id)
      await insertSong(path, songContent.item[0])
    }
    loggedSongs++
    progressCb(loggedSongs, songCount)
  }

  await syncAlbums()
}
