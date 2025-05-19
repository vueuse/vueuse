/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRef, Ref } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { ref as deepRef, shallowRef, watch } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseUserMediaOptions extends ConfigurableNavigator {
  /**
   * If the stream is enabled
   * @default false
   */
  enabled?: MaybeRef<boolean>
  /**
   * Recreate stream when deviceIds or constraints changed
   *
   * @default true
   */
  autoSwitch?: MaybeRef<boolean>
  /**
   * MediaStreamConstraints to be applied to the requested MediaStream
   * If provided, the constraints will override videoDeviceId and audioDeviceId
   *
   * @default {}
   */
  constraints?: MaybeRef<MediaStreamConstraints>
}

/**
 * Reactive `mediaDevices.getUserMedia` streaming
 *
 * @see https://vueuse.org/useUserMedia
 * @param options
 */
export function useUserMedia(options: UseUserMediaOptions = {}) {
  const enabled = shallowRef(options.enabled ?? false)
  const autoSwitch = shallowRef(options.autoSwitch ?? true)
  const constraints = deepRef(options.constraints)
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.mediaDevices?.getUserMedia)

  const stream: Ref<MediaStream | undefined> = shallowRef()

  function getDeviceOptions(type: 'video' | 'audio') {
    switch (type) {
      case 'video': {
        if (constraints.value)
          return constraints.value.video || false
        break
      }
      case 'audio': {
        if (constraints.value)
          return constraints.value.audio || false
        break
      }
    }
  }

  async function _start() {
    if (!isSupported.value || stream.value)
      return
    stream.value = await navigator!.mediaDevices.getUserMedia({
      video: getDeviceOptions('video'),
      audio: getDeviceOptions('audio'),
    })
    return stream.value
  }

  function _stop() {
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

  async function restart() {
    _stop()
    return await start()
  }

  watch(
    enabled,
    (v) => {
      if (v)
        _start()
      else _stop()
    },
    { immediate: true },
  )

  watch(
    constraints,
    () => {
      if (autoSwitch.value && stream.value)
        restart()
    },
    { immediate: true },
  )

  tryOnScopeDispose(() => {
    stop()
  })

  return {
    isSupported,
    stream,
    start,
    stop,
    restart,
    constraints,
    enabled,
    autoSwitch,
  }
}

export type UseUserMediaReturn = ReturnType<typeof useUserMedia>
