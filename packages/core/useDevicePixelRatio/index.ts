import { ref, onUnmounted } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { isClient, tryOnMounted } from '@vueuse/shared'

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
  if (!isClient) {
    return {
      pixelRatio: ref(1),
    }
  }

  const pixelRatio = ref(window.devicePixelRatio)

  const handleDevicePixelRatio = () => {
    pixelRatio.value = window.devicePixelRatio
  }

  tryOnMounted(handleDevicePixelRatio)

  useEventListener('resize', handleDevicePixelRatio)

  DEVICE_PIXEL_RATIO_SCALES.forEach((dppx) => {
    // listen mql events in both sides
    const mqlMin = window.matchMedia(`screen and (min-resolution: ${dppx}dppx)`)
    const mqlMax = window.matchMedia(`screen and (max-resolution: ${dppx}dppx)`)

    mqlMin.addEventListener('change', handleDevicePixelRatio)
    mqlMax.addEventListener('change', handleDevicePixelRatio)

    onUnmounted(() => {
      mqlMin.removeEventListener('change', handleDevicePixelRatio)
      mqlMax.removeEventListener('change', handleDevicePixelRatio)
    })
  })

  return { pixelRatio }
}
