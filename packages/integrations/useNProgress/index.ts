import nprogress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted, isNumber, isBoolean } from '@vueuse/shared'
import { ref, isRef, watch } from 'vue-demi'

/**
 * Reactive progress bar.
 *
 * @see   {@link https://vueuse.js.org/useNProgress}
 * @param currentProgress
 * @param options
 */
export function useNProgress(
  currentProgress: MaybeRef<number | null | undefined> = null,
  options?: NProgressOptions | undefined,
) {
  const progress = isRef(currentProgress)
    ? currentProgress
    : ref<number|null>(currentProgress)
  const isLoading = ref<boolean|null>(null)

  if (options)
    nprogress.configure(options)

  const setProgress = nprogress.set
  nprogress.set = (n: number) => {
    progress.value = n
    return setProgress.call(nprogress, n)
  }

  watch(isLoading, (l) => {
    if (isBoolean(l))
      l ? nprogress.start() : nprogress.done()
    else
      nprogress.remove()
  }, {
    immediate: true,
  })

  tryOnUnmounted(nprogress.remove)

  return {
    isLoading,
    progress,
    start: () => {
      progress.value = null
      isLoading.value = true
    },
    done: () => {
      progress.value = null
      isLoading.value = false
    },
    remove: () => {
      progress.value = null
      isLoading.value = null
    },
  }
}
