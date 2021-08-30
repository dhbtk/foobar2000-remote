import { SoundBuffer } from './SoundBuffer'

const context = new AudioContext()
const gain = context.createGain()
gain.gain.value = 0.05
gain.connect(context.destination)

const soundBuffer = new SoundBuffer(context, gain,44100, 3, false)

function playChunk (leftBuffer: Float32Array, rightBuffer: Float32Array) {
  soundBuffer.addChunk(leftBuffer, rightBuffer)
}

export function setGain (value: number): void {
  gain.gain.value = value
}

export function startListening (): void {
  const worker = new Worker(new URL('./worker.ts', import.meta.url))
  worker.onmessage = (e) => {
    const [leftBuffer, rightBuffer]: Float32Array[] = e.data
    playChunk(leftBuffer, rightBuffer)
  }
  worker.postMessage({})
}
