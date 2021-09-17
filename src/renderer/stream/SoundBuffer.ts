export class SoundBuffer {
  private chunks: Array<AudioBufferSourceNode> = []
  private isPlaying = false
  private startTime = 0
  private lastChunkOffset = 0

  constructor (public ctx: AudioContext, public gain: GainNode, public sampleRate: number, public bufferSize: number = 6, private debug = true) { }

  private createChunk (leftChunk: Float32Array, rightChunk: Float32Array) {
    const audioBuffer = this.ctx.createBuffer(2, leftChunk.length, this.sampleRate)
    audioBuffer.getChannelData(0).set(leftChunk)
    audioBuffer.getChannelData(1).set(rightChunk)
    const source = this.ctx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.gain)
    source.onended = (e: Event) => {
      this.chunks.splice(this.chunks.indexOf(source), 1)
      if (this.chunks.length == 0) {
        this.isPlaying = false
        this.startTime = 0
        this.lastChunkOffset = 0
      }
    }

    return source
  }

  private log (data: string) {
    if (this.debug) {
      console.log(new Date().toUTCString() + ' : ' + data)
    }
  }

  public addChunk (leftData: Float32Array, rightData: Float32Array) {
    if (this.isPlaying && (this.chunks.length > this.bufferSize)) {
      this.log('chunk discarded')
      return // throw away
    } else if (this.isPlaying && (this.chunks.length <= this.bufferSize)) { // schedule & add right now
      this.log('chunk accepted')
      const chunk = this.createChunk(leftData, rightData)
      chunk.start(this.startTime + this.lastChunkOffset)
      this.lastChunkOffset += chunk.buffer.duration
      this.chunks.push(chunk)
    } else if ((this.chunks.length < (this.bufferSize / 2)) && !this.isPlaying) {  // add & don't schedule
      this.log('chunk queued')
      const chunk = this.createChunk(leftData, rightData)
      this.chunks.push(chunk)
    } else { // add & schedule entire buffer
      this.log('queued chunks scheduled')
      this.isPlaying = true
      const chunk = this.createChunk(leftData, rightData)
      this.chunks.push(chunk)
      this.startTime = this.ctx.currentTime
      this.lastChunkOffset = 0
      for (let i = 0; i < this.chunks.length; i++) {
        const chunk = this.chunks[i]
        chunk.start(this.startTime + this.lastChunkOffset)
        this.lastChunkOffset += chunk.buffer.duration
      }
    }
  }
}
