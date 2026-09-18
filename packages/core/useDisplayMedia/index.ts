import type { MaybeRef, ShallowRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import type { Supportable } from '../types'
import { shallowRef, watch } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export interface UseDisplayMediaOptions extends ConfigurableNavigator {
  /**
   * If the stream is enabled
   * @default false
   */
  enabled?: MaybeRef<boolean>

  /**
   * If the stream video media constraints
   */
  video?: boolean | MediaTrackConstraints | undefined
  /**
   * If the stream audio media constraints
   */
  audio?: boolean | MediaTrackConstraints | undefined
}

export interface UseDisplayMediaReturn extends Supportable {
  stream: ShallowRef<MediaStream | undefined>
  start: () => Promise<MediaStream | undefined>
  stop: () => void
  enabled: ShallowRef<boolean>
}

/**
 * Reactive `mediaDevices.getDisplayMedia` streaming
 *
 * @see https://vueuse.org/useDisplayMedia
 * @param options
 */
export function useDisplayMedia(options: UseDisplayMediaOptions = {}): UseDisplayMediaReturn {
  const enabled = shallowRef(options.enabled ?? false)
  const video = options.video
  const audio = options.audio
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.mediaDevices?.getDisplayMedia)

  const constraint: MediaStreamConstraints = { audio, video }

  const stream = shallowRef<MediaStream | undefined>()
  let starting = false
  let startId = 0

  async function _start() {
    if (!isSupported.value || stream.value || starting)
      return

    starting = true
    const id = ++startId

    try {
      const mediaStream = await navigator!.mediaDevices.getDisplayMedia(constraint)

      if (id !== startId) {
        mediaStream.getTracks().forEach(t => t.stop())
        return
      }

      stream.value = mediaStream
      stream.value.getTracks().forEach(t => useEventListener(t, 'ended', stop, { passive: true }))
      return stream.value
    }
    finally {
      if (id === startId)
        starting = false
    }
  }

  async function _stop() {
    startId++
    starting = false
    stream.value?.getTracks().forEach(t => t.stop())
    stream.value = undefined
  }

  function stop() {
    _stop()
    enabled.value = false
  }

  async function start() {
    await _start()
    if (stream.value)
      enabled.value = true
    return stream.value
  }

  watch(
    enabled,
    (v) => {
      if (v)
        _start()
      else
        _stop()
    },
    { immediate: true },
  )

  return {
    isSupported,
    stream,
    start,
    stop,
    enabled,
  }
}
