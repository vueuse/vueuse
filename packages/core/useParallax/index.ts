import { MaybeRef } from '@vueuse/shared'
import { computed } from 'vue-demi'
import { useDeviceOrientation } from '../useDeviceOrientation'
import { useMouseInElement } from '../useMouseInElement'
import { ConfigurableWindow } from '../_configurable'

export interface ParallaxOptions extends ConfigurableWindow {
  deviceOrientationTiltAdjust?: (i: number) => number
  deviceOrientationRollAdjust?: (i: number) => number
  mouseTiltAdjust?: (i: number) => number
  mouseRollAdjust?: (i: number) => number
  targetElement?: MaybeRef<Element | null | undefined>
}

export function useParallax(target: MaybeRef<Element | null | undefined>, options: ParallaxOptions = {}) {
  const {
    deviceOrientationTiltAdjust = i => i,
    deviceOrientationRollAdjust = i => i,
    mouseTiltAdjust = i => i,
    mouseRollAdjust = i => i,
    window,
  } = options

  const { beta: deviceBeta, gamma: deviceGamma, isSupported: isOrientationSupported } = useDeviceOrientation({ window })
  const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(target, { handleOutside: false, window })

  const source = computed(() => {
    if (isOrientationSupported && deviceBeta.value != null && deviceBeta.value != null)
      return 'deviceOrientation'
    return 'mouse'
  })

  const roll = computed(() => {
    if (source.value === 'deviceOrientation' && deviceBeta.value != null) {
      const value = -deviceBeta.value / 180
      return deviceOrientationRollAdjust(value)
    }
    else {
      const value = -(elementY.value - elementHeight.value / 2) / elementHeight.value
      return mouseRollAdjust(value)
    }
  })

  const tilt = computed(() => {
    if (source.value === 'deviceOrientation' && deviceGamma.value != null) {
      const value = deviceGamma.value / 180
      return deviceOrientationTiltAdjust(value)
    }
    else {
      const value = (elementX.value - elementWidth.value / 2) / elementWidth.value
      return mouseTiltAdjust(value)
    }
  })

  return { roll, tilt, source }
}
