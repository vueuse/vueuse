import nprogress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch, isRef } from 'vue-demi'

/**
 * Reactive progress bar.
 *
 * @see   {@link https://vueuse.js.org/useNProgress}
 * @param currentStatus
 * @param options
 */
export function useNProgress(
  currentStatus: MaybeRef<boolean | null | undefined> = null,
  options?: NProgressOptions | undefined,
) {
  const progress = ref<number>(0)
  const isLoading = isRef(currentStatus)
    ? currentStatus
    : ref<boolean | null>(currentStatus)

  if (options)
    nprogress.configure(options)

  watch(isLoading, active => active ? nprogress.start() : nprogress.done())

  watch(progress, (n) => {
    nprogress.set(n)
  })

  tryOnUnmounted(nprogress.remove)

  return {
    isLoading,
    progress,
  }
}
