/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref, shallowRef, watch } from 'vue-demi'
import { useSupported } from '../useSupported'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'

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
   * The device id of video input
   *
   * When passing with `undefined` the default device will be used.
   * Pass `false` or "none" to disabled video input
   *
   * @default undefined
   * @deprecated in favor of constraints
   */
  videoDeviceId?: MaybeRef<string | undefined | false | 'none'>
  /**
   * The device id of audi input
   *
   * When passing with `undefined` the default device will be used.
   * Pass `false` or "none" to disabled audi input
   *
   * @default undefined
   * @deprecated in favor of constraints
   */
  audioDeviceId?: MaybeRef<string | undefined | false | 'none'>
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
  const enabled = ref(options.enabled ?? false)
  const autoSwitch = ref(options.autoSwitch ?? true)
  const videoDeviceId = ref(options.videoDeviceId)
  const audioDeviceId = ref(options.audioDeviceId)
  const constraints = ref(options.constraints)
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator?.mediaDevices?.getUserMedia)

  const stream: Ref<MediaStream | undefined> = shallowRef()

  function getDeviceOptions(type: 'video' | 'audio') {
    switch (type) {
      case 'video': {
        if (constraints.value)
          return constraints.value.video || false
        if (videoDeviceId.value === 'none' || videoDeviceId.value === false)
          return false
        if (videoDeviceId.value == null)
          return true
        return { deviceId: videoDeviceId.value }
      }
      case 'audio': {
        if (constraints.value)
          return constraints.value.audio || false
        if (audioDeviceId.value === 'none' || audioDeviceId.value === false)
          return false
        if (audioDeviceId.value == null)
          return true
        return { deviceId: audioDeviceId.value }
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
    [videoDeviceId, audioDeviceId, constraints],
    () => {
      if (autoSwitch.value && stream.value)
        restart()
    },
    { immediate: true },
  )

  return {
    isSupported,
    stream,
    start,
    stop,
    restart,
    videoDeviceId,
    audioDeviceId,
    constraints,
    enabled,
    autoSwitch,
  }
}

export type UseUserMediaReturn = ReturnType<typeof useUserMedia>
