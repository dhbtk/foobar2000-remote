declare const self: DedicatedWorkerGlobalScope
export {}

const playbackBufferLength = 40960
let rollingBuffer: Buffer[] = []
let isFirstChunk = true
let abortController: AbortController
let abortSignal: AbortSignal

function int16ToFloat32(inputArray: Int16Array, startIndex: number, length: number): Float32Array {
  const output = new Float32Array(inputArray.length - startIndex)
  for (let i = startIndex; i < length; i++) {
    output[i] = inputArray[i] / 32768
  }
  return output;
}

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
  self.postMessage([leftData, rightData])
}

function readStream (reader: ReadableStreamDefaultReader<Uint8Array>) {
  reader.read().then(({ done, value }) => {
    parseChunk(Buffer.from(value))
    if (!done) {
      readStream(reader)
    }
  })
}

function startListening () {
  abortController = new AbortController()
  abortSignal = abortController.signal
  isFirstChunk = true
  fetch(
    'http://192.168.18.3:56923/content/psc.wav',
    {
      headers: {
        Authorization: 'Basic ' + btoa('foo:bar')
      },
      signal: abortSignal
    }
  ).then(r => readStream(r.body.getReader())).catch(e => {
    console.error(e)
    setTimeout(() => startListening(), 1000)
  })
}

function stopListening () {
  abortController?.abort()
}

self.onmessage = ({ data }: MessageEvent<string>) => {
  switch (data) {
    case 'start':
      startListening()
      break
    case 'stop':
      stopListening()
      break
  }
}
