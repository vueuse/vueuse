import type { MaybeRef } from '@vueuse/shared'
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
  newIcon: MaybeRef<string | null | undefined> = null,
  options: FaviconOptions = {},
) {
  const {
    baseUrl = '',
    rel = 'icon',
    document = defaultDocument,
  } = options

  const favicon = isRef(newIcon)
    ? newIcon
    : ref<string | null>(newIcon)

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
