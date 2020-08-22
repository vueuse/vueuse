import { ref, onUnmounted } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { tryOnMounted } from '../utils'

// device pixel ratio statistics from https://www.mydevice.io/
export const DEVICE_PIXEL_RATIO_SCALES = [
  1,
  1.325,
  1.4,
  1.5,
  1.8,
  2,
  2.4,
  2.5,
  2.75,
  3,
  3.5,
  4,
]

export function useDevicePixelRatio() {
  const pixelRatio = ref(typeof window === 'undefined' ? 1 : window.devicePixelRatio)

  if (typeof window === 'undefined') return { pixelRatio }

  const handleDevicePixelRatio = () => {
    pixelRatio.value = window.devicePixelRatio
  }

  tryOnMounted(handleDevicePixelRatio)

  useEventListener('resize', handleDevicePixelRatio)

  DEVICE_PIXEL_RATIO_SCALES.forEach((dppx) => {
    // listen mql events in both sides
    const mqlMin = window.matchMedia(`screen and (min-resolution: ${dppx}dppx)`)
    const mqlMax = window.matchMedia(`screen and (max-resolution: ${dppx}dppx)`)

    mqlMin.addListener(handleDevicePixelRatio)
    mqlMax.addListener(handleDevicePixelRatio)

    onUnmounted(() => {
      mqlMin.removeListener(handleDevicePixelRatio)
      mqlMax.removeListener(handleDevicePixelRatio)
    })
  })

  return { pixelRatio }
}
