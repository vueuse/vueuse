import { ref } from 'vue-demi'
import { useIntervalFn } from '@vueuse/shared'
import { useLocalStorage } from '../useLocalStorage'

interface UseVerificationCodeConfig {
  /** Start the countdown at what */
  seconds?: number
  /**  Whether to refresh to continue countdown upon re-entry */
  keepRunning?: boolean
  /** uniqueKey */
  uniqueKey?: string
}

export function useVerificationCode(
  config: UseVerificationCodeConfig = {},
) {
  const { seconds = 60, keepRunning = false, uniqueKey = 'verificationCodeStorageKey' } = config
  const storageKey = uniqueKey
  const storagData = keepRunning ? useLocalStorage<number | null>(storageKey, null) : null
  const innerSeconds = ref<number>(seconds)
  const { pause, resume, isActive } = useIntervalFn(() => {
    innerSeconds.value--
    if (innerSeconds.value < 0)
      _handleEnd()
  }, 1000, {
    immediate: false,
  })

  if (storagData && storagData.value) {
    const remainingSecond = seconds - Math.ceil((Date.now() - storagData.value) / 1000)
    if (remainingSecond > 0) {
      innerSeconds.value = remainingSecond
      _handleStart()
    }
    else {
      _handleEnd()
    }
  }

  function _handleStart() {
    resume()
  }

  function _handleEnd() {
    pause()
    storagData && (storagData.value = null)
    innerSeconds.value = seconds
  }

  function getCode() {
    if (isActive.value)
      return
    storagData && (storagData.value = Date.now())
    _handleStart()
  }

  return {
    getCode,
    seconds: innerSeconds,
    isActive,
  }
}
