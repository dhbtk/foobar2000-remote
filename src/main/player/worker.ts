import { RtAudio, RtAudioFormat } from 'audify'
import fetch, { AbortError } from 'node-fetch'
import AbortController from 'abort-controller'

const streamUrl = 'http://foo:bar@192.168.18.3:56923/content/psc.wav'
const FRAME_SIZE = 1920
const rtAudio = new RtAudio()

export function streamStart (): void {
  console.log('streamStart')
  rtAudio.openStream(
    {
      deviceId: rtAudio.getDefaultOutputDevice(),
      nChannels: 2,
      firstChannel: 0
    },
    null,
    RtAudioFormat.RTAUDIO_SINT16,
    44100,
    FRAME_SIZE,
    "foobar2000-remote",
    null,
    null
  )
  rtAudio.start()
  startListening()
}

const BYTE_BUFFER_LENGTH = 2 * 2 * FRAME_SIZE
let bigBuffer: Buffer = new Buffer(0)
let isFirstChunk = true
let abortController: AbortController
let signal: AbortSignal
let playing = false

function parseHeader (chunk: Buffer) {
  const riff = chunk.toString('ascii', 0, 4)
  const size = chunk.readInt32LE(4)
  const wave = chunk.toString('ascii', 8, 12)
  const fmt = chunk.toString('ascii', 12, 16)
  const len = chunk.readInt32LE(16)
  const type = chunk.readInt16LE(20)
  const channels = chunk.readInt16LE(22)
  const sampleRate = chunk.readInt32LE(24)
  const bitRate = chunk.readInt32LE(28)
  const blockAlign = chunk.readInt16LE(32)
  const bitsPerSample = chunk.readInt16LE(34)
  const data = chunk.toString('ascii', 36, 40)

  console.table({ riff, size, wave, fmt, len, type, channels, sampleRate, bitRate, blockAlign, bitsPerSample, data })
}

function parseChunk (chunk: Buffer) {
  if (!playing) {
    return
  }
  if (isFirstChunk) {
    parseHeader(chunk)
    isFirstChunk = false
    parseChunk(chunk.slice(44))
  } else {
    bigBuffer = Buffer.concat([bigBuffer, chunk])
    while (bigBuffer.length >= BYTE_BUFFER_LENGTH) {
      const playbackData = bigBuffer.slice(0, BYTE_BUFFER_LENGTH)
      if (playbackData.length !== BYTE_BUFFER_LENGTH) {
        console.error('playbackData.length !== BYTE_BUFFER_LENGTH: ' + playbackData.length + ', ' + BYTE_BUFFER_LENGTH)
      }
      rtAudio.write(playbackData)
      bigBuffer = bigBuffer.slice(BYTE_BUFFER_LENGTH)
    }
  }
}

async function readStream (reader: NodeJS.ReadableStream) {
  for await (const chunk of reader) {
    if (typeof chunk !== 'string') {
      parseChunk(chunk)
    }
  }
}

async function startListening () {
  playing = true
  abortController = new AbortController()
  signal = abortController.signal
  isFirstChunk = true
  const url = new URL(streamUrl)
  console.log('url: ', url)
  try {
    const headers = url.username ? (
      {
        Authorization: `Basic ${Buffer.from(`${url.username}:${url.password}`).toString('base64')}`
      }
    ) : {}
    const response = await fetch(`${url.origin}/${url.pathname}`, { headers, signal })
    await readStream(response.body)
  } catch (e) {
    if (e instanceof AbortError) {
      console.log('playback aborted')
    } else {
      console.error(e)
      setTimeout(() => startListening(), 1000)
    }
  }
}

export function streamStop (): void {
  playing = false
  abortController?.abort()
  if (rtAudio.isStreamOpen()) {
    rtAudio.outputVolume = 0
    rtAudio.clearOutputQueue()
    rtAudio.stop()
  }
}

export function setVolume (vol: number): void {
  rtAudio.outputVolume = vol
}
