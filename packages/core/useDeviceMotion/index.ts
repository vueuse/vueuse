/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from '../../api'
import { throttle } from '../../utils'
import { useEventListener } from '../useEventListener'

interface DeviceMotionOptions {
  throttleMs: 10
}

export function useDeviceMotion(options: DeviceMotionOptions = { throttleMs: 10 }) {
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

  const handler = options.throttleMs ? throttle(options.throttleMs, onDeviceMotion) : onDeviceMotion

  useEventListener('devicemotion', handler, false)

  return {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
  }
}
