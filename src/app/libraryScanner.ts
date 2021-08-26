import upnpClient from '../upnp/renderer'
import { getDatabase } from './library/DatabaseWrapper'

export async function rescan (progressCb: (progress: number, total: number) => void): Promise<void> {
  const mediaLibraryId = await upnpClient.browse().then(xml => xml.container.find(c => c.title === 'Media Library').id)
  const foldersId = await upnpClient.browse(mediaLibraryId).then(xml => xml.container.find(c => c.title === 'All Files').id)

  await scanAllFiles(foldersId, progressCb)
}

async function scanAllFiles (rootId: string, progressCb: (progress: number, total: number) => void): Promise<void> {
  const wrapper = await getDatabase()
  await wrapper.clearSongs()
  const allContents = await upnpClient.browse(rootId)
  const songCount = allContents.container.length
  let loggedSongs = 0

  for (const container of allContents.container) {
    const { id, title } = container
    const songContent = await upnpClient.browse(id)
    loggedSongs++
    await wrapper.insertSong(title, songContent.item[0])
    progressCb(loggedSongs, songCount)
  }
}
