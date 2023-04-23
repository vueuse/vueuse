import { ref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'

type Timer = NodeJS.Timeout | null

interface AsyncLoadingOptions {
  /**
   * show loading after x ms
   */
  timeout?: number
  /**
   * if loading is shown, it will be shown for at least x ms
   */
  delay?: number
  /**
   * default loading
   */
  defaultLoading?: Ref<boolean>
}

export function useAsyncLoading(options?: AsyncLoadingOptions) {
  const timeout = options?.timeout || 500
  const delay = options?.delay || 500
  const defaultLoading = options?.defaultLoading || ref(false)

  const asyncLoading = ref(defaultLoading.value)
  let showTime = 0

  /**
   * show loading timer
   */
  let timer: Timer = null
  /**
   * hide loading timer
   */
  let delayTimer: Timer = null

  function showLoading() {
    if (asyncLoading.value) {
      delayTimer && clearTimeout(delayTimer)
      delayTimer = null
      return
    }

    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      asyncLoading.value = true
      showTime = Date.now()
      timer && clearInterval(timer)
      timer = null
    }, timeout)
  }

  function hideLoading() {
    if (!asyncLoading.value) {
      timer && clearTimeout(timer)
      timer = null
      return
    }

    delayTimer && clearTimeout(delayTimer)
    delayTimer = setTimeout(() => {
      asyncLoading.value = false
    }, Math.max(0, delay - (Date.now() - showTime)))
  }

  watch(defaultLoading, (val) => {
    if (val)
      showLoading()
    else
      hideLoading()
  })

  return {
    asyncLoading,
    showLoading,
    hideLoading,
  }
}
