/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useThrottleFn } from '../useThrottleFn'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

interface DeviceMotionOptions extends ConfigurableWindow {
  throttleMs?: number
}

export function useDeviceMotion(options: DeviceMotionOptions = {}) {
  const {
    window = defaultWindow,
    throttleMs = 10,
  } = options

  const acceleration: Ref<DeviceMotionEvent['acceleration']> = ref({ x: null, y: null, z: null })
  const rotationRate: Ref<DeviceMotionEvent['rotationRate']> = ref({ alpha: null, beta: null, gamma: null })
  const interval = ref(0)
  const accelerationIncludingGravity: Ref<DeviceMotionEvent['accelerationIncludingGravity']> = ref({
    x: null,
    y: null,
    z: null,
  })

  function onDeviceMotion(event: DeviceMotionEvent) {
    acceleration.value = event.acceleration
    accelerationIncludingGravity.value = event.accelerationIncludingGravity
    rotationRate.value = event.rotationRate
    interval.value = event.interval
  }

  const handler = useThrottleFn(onDeviceMotion, throttleMs)

  if (window)
    useEventListener(window, 'devicemotion', handler)

  return {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
  }
}
