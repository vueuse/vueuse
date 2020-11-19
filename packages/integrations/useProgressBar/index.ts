import progress, { NProgressOptions } from 'nprogress'
import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch, isRef } from 'vue-demi'

/**
 * Reactive progress bar.
 *
 * @see   {@link https://vueuse.js.org/useProgressBar}
 * @param newIcon
 * @param options
 */
export function useProgressBar(
  current: MaybeRef<boolean | null | undefined> = null,
  options?: NProgressOptions | undefined,
) {
  const loading = isRef(current)
    ? current
    : ref<boolean | null>(current)

  if (options)
    progress.configure(options)

  watch(loading, active => active ? progress.start() : progress.done())

  tryOnUnmounted(progress.remove)

  return loading
}
