import { computed, Ref } from '../api'
import { useDeviceOrientation } from '../useDeviceOrientation'
import { useMouse } from '../useMouse'

interface ParallaxOptions {
  mouseXMultiplier: number
  mouseYMultiplier: number
  deviceAlphaMultiplier: number
  deviceBetaMultiplier: number
  refEl?: Ref<Element>
}

const defaultParallaxOptions: ParallaxOptions = {
  mouseXMultiplier: 1,
  mouseYMultiplier: 1,
  deviceAlphaMultiplier: 0.5,
  deviceBetaMultiplier: 0.5,
}

export function useParallax (options?: Partial<ParallaxOptions>) {
  const _options: ParallaxOptions = Object.assign({}, defaultParallaxOptions, options)

  const { beta: deviceBeta, gamma: deviceGamma } = useDeviceOrientation()
  const { elementX, elementY, elementWidth, elementHeight } = useMouse(_options.refEl, false)

  const source = computed(() => {
    if (deviceBeta.value != null && deviceBeta.value != null)
      return 'deviceOrientation'
    return 'mouse'
  })

  const roll = computed(() => {
    if (source.value === 'deviceOrientation' && deviceBeta.value != null)
      return deviceBeta.value / 180
    return (elementX.value - elementWidth.value / 2) / elementWidth.value
  })

  const tilt = computed(() => {
    if (source.value === 'deviceOrientation' && deviceGamma.value != null)
      return deviceGamma.value / 180
    return (elementY.value - elementHeight.value / 2) / elementHeight.value
  })

  return { roll, tilt, source }
}
