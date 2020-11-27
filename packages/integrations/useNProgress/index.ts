import nprogress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted, isNumber } from '@vueuse/shared'
import { ref, watch, isRef } from 'vue-demi'

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
    : ref(currentProgress)
  const isLoading = ref<boolean>(false)

  if (options)
    nprogress.configure(options)

  // watch(isLoading, active => active ? nprogress.start() : nprogress.done())

  watch([progress, isLoading], (n, l) => {
    if (isNumber(n) && n < 1) {
      nprogress.set(n)
      isLoading.value = true
    }
    else {
      isLoading.value = false
    }
  }, {
    immediate: true,
  })

  tryOnUnmounted(nprogress.remove)

  return {
    isLoading,
    progress,
    start: () => isLoading.value = true,
    done: () => isLoading.value = false,
    remove: () => isLoading.value = false && nprogress.remove,
  }
}
