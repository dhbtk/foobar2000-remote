declare module 'node-ssdp'
declare module 'upnp-device-client' {
  type Callback = (error: Error | undefined, result: unknown) => unknown

  declare class Client {
    constructor (url: string);

    getDeviceDescription (callback: Callback): void;

    getServiceDescription (service: string, callback: Callback): void;

    callAction (service: string, action: string, parameters: Record<string, string>, callback: Callback): void;

    subscribe (service: string, callback: (event: unknown) => unknown): void;
  }

  export default Client
  export { Callback }
}

declare module '*.mp3'

declare module 'electron-media-service' {
  export type Metadata = {
    title: string
    artist: string
    album: string
    albumArt: string
    state: string,
    id: number,
    currentTime: number
    duration: number
  }
  declare class MediaService {
    startService (): void

    setMetaData (metadata: Metadata): void

    on (event: string, callback: (to: number) => void): void
  }

  export default MediaService
}
