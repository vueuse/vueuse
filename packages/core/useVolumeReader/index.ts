import { ref } from 'vue-demi'
import { tryOnBeforeUnmount } from '@vueuse/core'

export interface UseVolumeReaderOptions {
  track: MediaStreamTrack | undefined
  context?: AudioContext
  interval?: number
}

export function useVolumeReader(options: UseVolumeReaderOptions) {
  let track = options.track
  const interval = options.interval || 33
  const context = options.context || new AudioContext()

  const volume = ref(0)
  let readInterval: number | undefined

  let analyserNode: AnalyserNode | undefined
  let sourceNode: MediaStreamAudioSourceNode | undefined

  async function _start() {
    if (!track)
      return
    if (context.state !== 'running')
      await context.resume().catch(console.warn)

    analyserNode = context.createAnalyser()
    analyserNode.minDecibels = -90
    analyserNode.maxDecibels = -10
    analyserNode.smoothingTimeConstant = 0.85

    sourceNode = context.createMediaStreamSource(new MediaStream([track]))
    sourceNode.connect(analyserNode)
    const pcmData = new Float32Array(analyserNode.fftSize)

    const readVolumeFn = () => {
      if (!analyserNode) {
        volume.value = 0
        return
      }

      analyserNode.getFloatTimeDomainData(pcmData)
      let sumSquares = 0.0
      for (const amplitude of pcmData)
        sumSquares += amplitude * amplitude

      volume.value = Math.sqrt(sumSquares / pcmData.length) * 100
    }

    readInterval = window.setInterval(readVolumeFn, interval)
  }

  function stop() {
    clearInterval(readInterval)
    analyserNode?.disconnect()
    sourceNode?.disconnect()
    analyserNode = undefined
    sourceNode = undefined
  }

  function changeTrack(newTrack: MediaStreamTrack | undefined) {
    stop()
    track = newTrack
    _start()
  }

  tryOnBeforeUnmount(stop)

  _start()

  return {
    volume,
    stop,
    changeTrack,
  }
}
