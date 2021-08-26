import dgramType from 'dgram'
import { streamUrl } from '../api/api'

let lastFrameCount = 0

const sampleSizes = [
  6000, 12000, 24000, 48000, 96000, 192000, 384000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 11025, 22050,
  44100, 88200, 176400, 352800, 705600
]
const playbackBufferLength = 40960

const leftBuffer = new Float32Array(playbackBufferLength)
const rightBuffer = new Float32Array(playbackBufferLength)
let bufferedAmount = 0

function int16ToFloat32(inputArray: Int16Array, startIndex: number, length: number): Float32Array {
  const output = new Float32Array(inputArray.length - startIndex)
  for (let i = startIndex; i < length; i++) {
    const int = inputArray[i]
    // If the high bit is on, then it is a negative number, and actually counts backwards.
    // output[i] = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
    output[i] = int / 32768
  }
  return output;
}

function playChunk () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  postMessage([leftBuffer, rightBuffer])
}

function handleMessage (msg: Buffer): void {
  const frameCount = msg.slice(23, 27).readUInt32LE()
  if (frameCount < lastFrameCount || bufferedAmount >= playbackBufferLength) {
    return
  }
  lastFrameCount = frameCount
  const sampleRate = sampleSizes[msg.readUInt8(4)]
  const sampleCount = msg.readUInt8(5) + 1
  const channels = msg.readUInt8(6) + 1
  const dataFormat = msg.readUInt8(7)
  /*
  #define VBAN_DATATYPE_BYTE8   0x00
  #define VBAN_DATATYPE_INT16   0x01
  #define VBAN_DATATYPE_INT24   0x02
  #define VBAN_DATATYPE_INT32   0x03
  #define VBAN_DATATYPE_FLOAT32  0x04
  #define VBAN_DATATYPE_FLOAT64  0x05
  #define VBAN_DATATYPE_12BITS   0x06
  #define VBAN_DATATYPE_10BITS   0x07
   */
  const data = msg.slice(28)
  const intCount = data.length / 2
  const sampleData = new Int16Array(intCount)
  for (let i = 0; i < intCount; i++) {
    sampleData[i] = data.readInt16LE(i * 2)
  }
  const float32Data = int16ToFloat32(sampleData, 0, sampleData.length)
  const dataLength = float32Data.length / 2
  const leftData = new Float32Array(float32Data.filter((_, i) => i % 2 === 0))
  const rightData = new Float32Array(float32Data.filter((_, i) => i % 2 !== 0))
  leftBuffer.set(leftData, bufferedAmount)
  rightBuffer.set(rightData, bufferedAmount)
  /*if (bufferedAmount === 0) {
    console.table({ sampleRate, sampleCount, channels, dataFormat,
      dataPacketLength: data.length,
      sampleDataLength: sampleData.length,
      channelDataLength: leftData.length,
      rawByteData: data.join(', '),
      rawIntData: sampleData.join(', '),
      rawLeftData: leftData.join(', '),
      rawRightData: rightData.join(', ')
    })
  }*/
  bufferedAmount += dataLength

  if (bufferedAmount >= playbackBufferLength) {
    playChunk()
    bufferedAmount = 0
  }
}

let isFirstChunk = true

function parseHeader (chunk: Buffer) {
  const riff = chunk.toString('ascii', 0, 3)
  const size = chunk.readInt32LE(4)
  const wave = chunk.toString('ascii', 8, 11)
  const fmt = chunk.toString('ascii', 12, 15)
  const len = chunk.readInt32LE(16)
  const type = chunk.readInt16LE(20)
  const channels = chunk.readInt16LE(22)
  const sampleRate = chunk.readInt32LE(24)
  const bitRate = chunk.readInt32LE(28)
  const blockAlign = chunk.readInt16LE(32)
  const bitsPerSample = chunk.readInt16LE(34)
  const data = chunk.toString('ascii', 36, 39)

  console.table({ riff, size, wave, fmt, len, type, channels, sampleRate, bitRate, blockAlign, bitsPerSample, data })
}

let rollingBuffer: Buffer[] = []

function parseChunk (chunk: Buffer) {
  if (isFirstChunk) {
    parseHeader(chunk)
    isFirstChunk = false
    parseChunk(chunk.slice(44))
  } else {
    rollingBuffer.push(chunk)
    const fullLength = rollingBuffer.reduce((s, buf) => s + buf.length, 0)
    if (fullLength >= playbackBufferLength) {
      decodeAllBuffers()
      rollingBuffer = []
    }
  }
}

function decodeAllBuffers () {
  const bigBuffer = Buffer.concat(rollingBuffer)
  const data = bigBuffer.slice(0, Math.floor(bigBuffer.length / 4) * 4)
  const intCount = data.length / 2
  const sampleData = new Int16Array(intCount)
  for (let i = 0; i < intCount; i++) {
    sampleData[i] = data.readInt16LE(i * 2)
  }
  const float32Data = int16ToFloat32(sampleData, 0, sampleData.length)
  const leftData = new Float32Array(float32Data.filter((_, i) => i % 2 === 0))
  const rightData = new Float32Array(float32Data.filter((_, i) => i % 2 !== 0))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  postMessage([leftData, rightData])
}

function readStream (reader: ReadableStreamDefaultReader<Uint8Array>) {
  reader.read().then(({ done, value }) => {
    parseChunk(Buffer.from(value))
    if (!done) {
      readStream(reader)
    }
  })
}

export function startListening (): void {
  const dgram: typeof dgramType = eval('require')('dgram')
  const socket = dgram.createSocket('udp4')
  socket.bind(6980, '192.168.18.123')
  /*socket.on('listening', () => {
    console.log('listening')
  })*/
  // socket.on('message', handleMessage)
  fetch('http://192.168.18.3:56923/content/psc.wav', { headers: { Authorization: 'Basic ' + btoa('foo:bar')}})
    .then(response => readStream(response.body.getReader()))
}

self.onmessage = () => {
  startListening()
}
