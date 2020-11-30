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

  watch([progress, isLoading], ([p, l]) => {
    if (isNumber(p)) {
      nprogress.set(p)
      isLoading.value = p < 1
    }
    else if (isBoolean(l)) {
      l ? nprogress.start() : nprogress.done()
    }
    else {
      nprogress.remove()
    }
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
