import { computed, Ref } from '../api'
import { useDeviceOrientation } from '../useDeviceOrientation'
import { useMouse } from '../useMouse'

export function useParallax (targetElement?: Ref<Element>) {
  const { beta: deviceBeta, gamma: deviceGamma } = useDeviceOrientation()
  const { elementX, elementY, elementWidth, elementHeight } = useMouse(targetElement, false)

  const source = computed(() => {
    if (deviceBeta.value != null && deviceBeta.value != null)
      return 'deviceOrientation'
    return 'mouse'
  })

  const roll = computed(() => {
    if (source.value === 'deviceOrientation' && deviceBeta.value != null)
      return deviceBeta.value / 180
    return -(elementY.value - elementHeight.value / 2) / elementHeight.value
  })

  const tilt = computed(() => {
    if (source.value === 'deviceOrientation' && deviceGamma.value != null)
      return deviceGamma.value / 180
    return (elementX.value - elementWidth.value / 2) / elementWidth.value
  })

  return { roll, tilt, source }
}
