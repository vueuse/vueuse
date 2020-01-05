import { computed, Ref } from '../../api'
import { useDeviceOrientation } from '../useDeviceOrientation'
import { useMouseInElement } from '../useMouseInElement'

export interface ParallaxOptions {
  deviceOrientationTiltAdjust?: (i: number) => number
  deviceOrientationRollAdjust?: (i: number) => number
  mouseTiltAdjust?: (i: number) => number
  mouseRollAdjust?: (i: number) => number
  targetElement?: Ref<Element>
}

export function useParallax (options?: ParallaxOptions) {
  const { beta: deviceBeta, gamma: deviceGamma } = useDeviceOrientation()
  const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(options?.targetElement, { handleOutside: false })

  const source = computed(() => {
    if (deviceBeta.value != null && deviceBeta.value != null)
      return 'deviceOrientation'
    return 'mouse'
  })

  const deviceOrientationTiltAdjust = options?.deviceOrientationTiltAdjust || (i => i)
  const deviceOrientationRollAdjust = options?.deviceOrientationRollAdjust || (i => i)
  const mouseTiltAdjust = options?.mouseTiltAdjust || (i => i)
  const mouseRollAdjust = options?.mouseRollAdjust || (i => i)

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
