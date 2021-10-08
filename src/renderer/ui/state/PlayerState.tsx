import React, { useEffect } from 'react'
import MetadataState from './MetadataState'
import StateStream from './StateStream'
import StreamPlayer from './StreamPlayer'

const stream = new StateStream()

export default function PlayerState (): React.ReactElement {
  useEffect(() => {
    stream.start()
    return () => {
      stream.stop()
    }
  }, [])
  return (
    <React.Fragment>
      <StreamPlayer/>
      <MetadataState/>
    </React.Fragment>
  )
}
