import React, { useEffect } from 'react'
import { useAppSelector } from '../../store'
import { getNativeMetadata } from '../../store/selectors'
import { shallowEqual } from 'react-redux'
import { setupRenderer, updateMetadata } from '../../stream/metadataClient'

export default function MetadataState (): React.ReactElement {
  const nativeMetadata = useAppSelector(getNativeMetadata, shallowEqual)
  useEffect(() => {
    setupRenderer()
  }, [])
  useEffect(() => {
    updateMetadata(nativeMetadata)
  }, [nativeMetadata])
  return <React.Fragment/>
}
