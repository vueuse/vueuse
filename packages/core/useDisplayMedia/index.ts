import type { MaybeRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref, shallowRef, watch } from 'vue-demi'
import { useSupported } from '../useSupported'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'

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
  const enabled = ref(options.enabled ?? false)
  const video = options.video
  const audio = options.audio
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.mediaDevices?.getDisplayMedia)

  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore Type mismatch in different version of TS
  const constraint: MediaStreamConstraints = { audio, video }

  const stream: Ref<MediaStream | undefined> = shallowRef()

  async function _start() {
    if (!isSupported.value || stream.value)
      return
    stream.value = await navigator!.mediaDevices.getDisplayMedia(constraint)
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
