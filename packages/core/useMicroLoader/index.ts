import type { MaybeRefOrGetter } from 'vue'
import { shallowRef, toValue, watchEffect } from 'vue'

const MIN_LOADING_TIME_MS = 500
const QUICK_LOADING_THRESHOLD_MS = 300

export function useMicroLoader(
  isLoadingRef: MaybeRefOrGetter<boolean>,
  {
    minLoadingTimeMs = MIN_LOADING_TIME_MS,
    quickLoadingThresholdMs = QUICK_LOADING_THRESHOLD_MS,
  }: {
    minLoadingTimeMs?: number
    quickLoadingThresholdMs?: number
  } = {},
) {
  const isMicroLoadingRef = shallowRef(false)
  let loadingStartTime: number | null = null
  let loadingTimeout: number | null = null

  watchEffect(() => {
    const newValue = toValue(isLoadingRef)

    if (newValue) {
      loadingStartTime = Date.now()

      loadingTimeout = setTimeout(() => {
        isMicroLoadingRef.value = true
      }, quickLoadingThresholdMs) as unknown as number
    }
    else {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
        loadingTimeout = null
      }

      if (loadingStartTime) {
        const loadingDuration = Date.now() - loadingStartTime

        if (loadingDuration < quickLoadingThresholdMs) {
          isMicroLoadingRef.value = false
        }
        else {
          const remainingTime = Math.max(0, minLoadingTimeMs - loadingDuration)

          setTimeout(() => {
            isMicroLoadingRef.value = false
          }, remainingTime)
        }
      }

      loadingStartTime = null
    }
  })

  return isMicroLoadingRef
}
