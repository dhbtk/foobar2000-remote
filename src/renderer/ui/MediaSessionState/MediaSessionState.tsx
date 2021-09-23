import React, { useEffect } from 'react'
import { useAppSelector } from '../../store'
import { getMediaImage, getMetadata } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { createStyles, makeStyles, Typography } from '@material-ui/core'
import { FileColumns } from '../../api/api'

const metadataInfo = (i: FileColumns): Array<[string, string]> => {
  return [
    ['Artist Name', i.artist],
    ['Track Title', i.title],
    ['Album Title', i.album],
    ['Date', i.date],
    ['Genre', i.genre],
    ['Track Number', i.trackNumber],
    ['Total Tracks', i.totalTracks],
    ['Comment', i.comment]
  ]
}
const locationInfo = (i: FileColumns): Array<[string, string]> => {
  return [
    ['File name', i.filename],
    ['Folder name', i.path],
    ['File path', i.path],
    ['Subsong index', i.subsong],
    ['File size', `${i.filesize} (${i.rawFilesize} bytes)`],
    ['Last modified', i.lastModified]
  ]
}
const generalInfo = (i: FileColumns): Array<[string, string]> => {
  return [
    ['Items selected', '1'],
    ['Duration', `${i.exactLength} (${i.sampleLength} samples)`],
    ['Sample rate', `${i.sampleRate} Hz`],
    ['Channels', i.channels],
    ['Bits per sample', '16'],
    ['Bitrate', i.bitrate],
    ['Codec', i.codec]
  ]
}

const InfoPane: React.FC<{title: string, data: Array<[string, string]>}> = ({ title, data }) => {
  return (
    <React.Fragment>
      <Typography component="h5" variant="body2">{title}</Typography>
      <table>
        <tbody>
        {data.map(([tag, value], i) => (
          <tr key={i}>
            <td style={{ whiteSpace: 'nowrap', width: 0 }}>{tag}</td>
            <td>{value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </React.Fragment>
  )
}
/*
left pane (metadata):

artist name
track title
album title
date
genre
track number
total tracks
comment

right pane (location):

file name
folder name
file path
subsong index
file size: (human size then full number) - 1.35 KB (1 385 bytes)
Last modified

(general):

items selected
duration: human duration + sample total - 4:40.760 (12 381 516 samples)
sample rate
channels
bits per sample
bitrate
codec
encoding
tool
embedded cuesheet
 */

const useStyles = makeStyles((theme) => createStyles({
  wrapper: {
    display: 'flex',
    minHeight: 128,
    height: 128,
    flexShrink: 0
  },
  image: {
    height: 128,
    width: 128,
    display: 'block',
    borderRight: '1px solid #ccc'
  },
  nowPlaying: {
    padding: theme.spacing(1),
    flex: 1,
    maxHeight: 128,
    overflow: 'auto'
  }
}))

const MediaSessionState: React.FC = () => {
  const classes = useStyles()
  const metadata = useAppSelector(getMetadata, shallowEqual)
  useEffect(() => {
    if (metadata === null) {
      window.document.title = 'foobar2000 remote'
    } else {
      window.document.title = `${metadata.artist} - [${metadata.album} #${metadata.itemInfo.trackNumber}] | ${metadata.title} [foobar2000 remote]`
    }
  }, [metadata])

  const mediaImage = useAppSelector(getMediaImage, shallowEqual)

  if (metadata === null) {
    return <div className={classes.wrapper} />
  } else {
    return (
      <div className={classes.wrapper}>
        <img alt="" src={mediaImage} className={classes.image} />
        <div className={classes.nowPlaying} style={{ width: 320, flex: '0 0 auto', resize: 'horizontal' }}>
          <InfoPane title="Metadata" data={metadataInfo(metadata.itemInfo)} />
        </div>
        <div className={classes.nowPlaying}>
          <InfoPane title="Location" data={locationInfo(metadata.itemInfo)} />
          <InfoPane title="General" data={generalInfo(metadata.itemInfo)} />
        </div>
      </div>
    )
  }
}

export default MediaSessionState
