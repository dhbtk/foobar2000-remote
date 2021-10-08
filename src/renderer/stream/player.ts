import { SoundBuffer } from './SoundBuffer'
import { IpcRenderer } from 'electron'

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer
const context = new AudioContext()
const gain = context.createGain()
let lastVolume = 0.05
gain.gain.value = lastVolume
gain.connect(context.destination)

const soundBuffer = new SoundBuffer(context, gain,44100, 3, false)
const worker = new Worker(new URL('./worker/worker.ts', import.meta.url))
worker.onmessage = (e) => {
  const [leftBuffer, rightBuffer]: Float32Array[] = e.data
  playChunk(leftBuffer, rightBuffer)
}

function playChunk (leftBuffer: Float32Array, rightBuffer: Float32Array) {
  soundBuffer.addChunk(leftBuffer, rightBuffer)
}

function applyVolume () {
  ipcRenderer.invoke('stream-set-volume', (Math.exp(lastVolume) - 1) / (Math.E - 1))
}

export function setGain (value: number): void {
  lastVolume = value
  applyVolume()
}

export function startListening (): void {
  applyVolume()
  ipcRenderer.invoke('stream-start')
  // worker.postMessage('start')
}

export function stopListening (): void {
  gain.gain.value = 0
  ipcRenderer.invoke('stream-stop')
  // worker.postMessage('stop')
}
