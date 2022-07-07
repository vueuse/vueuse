import { MaybeComputedRef, resolveUnref } from '@vueuse/shared'
import { isString } from '@vueuse/shared'
import { isRef, ref, watch } from 'vue-demi'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface FaviconOptions extends ConfigurableDocument {
  baseUrl?: string
  rel?: string
}

/**
 * Reactive favicon.
 *
 * @see https://vueuse.org/useFavicon
 * @param newIcon
 * @param options
 */
export function useFavicon(
  newIcon: MaybeComputedRef<string | null | undefined> = null,
  options: FaviconOptions = {},
) {
  const {
    baseUrl = '',
    rel = 'icon',
    document = defaultDocument,
  } = options


  const applyIcon = (icon: string) => {
    document?.head
      .querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
      .forEach(el => el.href = `${baseUrl}${icon}`)
  }

  watch(
    () => resolveUnref(newIcon),
    (i, o) => {
      if (isString(i) && i !== o)
        applyIcon(i)
    },
    { immediate: true },
  )

  return favicon
}
