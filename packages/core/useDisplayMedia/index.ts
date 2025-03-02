import type { MaybeRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
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

/**
 * Reactive `mediaDevices.getDisplayMedia` streaming
 *
 * @see https://vueuse.org/useDisplayMedia
 * @param options
 */
export function useDisplayMedia(options: UseDisplayMediaOptions = {}) {
  const enabled = shallowRef(options.enabled ?? false)
  const video = options.video
  const audio = options.audio
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.mediaDevices?.getDisplayMedia)

  const constraint: MediaStreamConstraints = { audio, video }

  const stream = shallowRef<MediaStream | undefined>()

  async function _start() {
    if (!isSupported.value || stream.value)
      return
    stream.value = await navigator!.mediaDevices.getDisplayMedia(constraint)
    stream.value?.getTracks().forEach(t => useEventListener(t, 'ended', stop, { passive: true }))
    return stream.value
  }

  async function _stop() {
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

export type UseDisplayMediaReturn = ReturnType<typeof useDisplayMedia>
