import { ref, watch } from 'vue-demi'

import type { MaybeElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'

export interface UseTextDirectionOptions {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string
  /**
   * Observe `document.querySelector(selector)` changes using MutationObserve
   *
   * @default false
   */
  observe?: boolean
}

/**
 * Reactive dir of the element's text.
 *
 * @see https://vueuse.org/useTextDirection
 * @param options
 */
export const useTextDirection = (
  options: UseTextDirectionOptions = {},
) => {
  const {
    selector = 'html',
    observe = false,
  } = options

  const defaultDir = 'ltr'
  const dir = ref(document.querySelector(selector)?.getAttribute('dir') ?? defaultDir)

  const isSupportedDir = (dir: string) => {
    return ['ltr', 'rtl', 'auto'].includes(dir)
  }

  watch(dir, () => {
    if (isSupportedDir(dir.value))
      document.querySelector(selector)?.setAttribute('dir', dir.value)
    else
      document.querySelector(selector)?.removeAttribute('dir')
  }, { immediate: true })

  if (observe && document) {
    useMutationObserver(
      document.querySelector(selector) as MaybeElement,
      () => {
        const crtDir = document.querySelector(selector)?.getAttribute('dir') ?? defaultDir
        dir.value = isSupportedDir(crtDir) ? crtDir : defaultDir
      },
      { attributes: true },
    )
  }

  return dir
}
