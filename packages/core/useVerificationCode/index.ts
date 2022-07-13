import { ref } from 'vue-demi'
import { useIntervalFn } from '@vueuse/shared'
import { useLocalStorage } from '../useLocalStorage'

interface UseVerificationCodeConfig {
  /** Start the countdown at what */
  seconds: number
  /**  Whether to refresh to continue countdown upon re-entry */
  keepRunning: boolean
}

export function useVerificationCode(
  config: UseVerificationCodeConfig = { seconds: 60, keepRunning: false },
) {
  const { seconds, keepRunning } = config
  const storageKey = 'verificationCodeStorageKey'
  const storagData = keepRunning ? useLocalStorage<number | null>(storageKey, null) : null
  const innerSeconds = ref<number>(seconds)
  const { pause, isActive, resume } = useIntervalFn(() => {
    innerSeconds.value--
    if (innerSeconds.value < 0)
      handleEnd()
  }, 1000, {
    immediate: false,
  })

  if (storagData && storagData.value) {
    const remainingSecond = seconds - Math.ceil((Date.now() - storagData.value) / 1000)
    if (remainingSecond) {
      innerSeconds.value = remainingSecond
      handleStart()
    }
    else {
      handleEnd()
    }
  }

  function getCode() {
    if (isActive.value)
      return
    storagData && (storagData.value = Date.now())
    handleStart()
  }

  function handleStart() {
    resume()
  }

  function handleEnd() {
    pause()
    storagData && (storagData.value = null)
    innerSeconds.value = seconds
  }

  return {
    getCode,
    seconds: innerSeconds,
    isActive,
  }
}
