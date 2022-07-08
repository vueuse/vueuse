import type { MaybeComputedRef } from '@vueuse/shared'
import { isString, resolveRef } from '@vueuse/shared'
import { watch } from 'vue-demi'
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

  const favicon = resolveRef(newIcon)

  const applyIcon = (icon: string) => {
    document?.head
      .querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
      .forEach(el => el.href = `${baseUrl}${icon}`)
  }

  watch(
    favicon,
    (i, o) => {
      if (isString(i) && i !== o)
        applyIcon(i)
    },
    { immediate: true },
  )

  return favicon
}
