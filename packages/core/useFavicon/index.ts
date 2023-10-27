import type { MaybeRef, MaybeRefOrGetter, ReadonlyRefOrGetter } from '@vueuse/shared'
import { toRef } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { watch } from 'vue-demi'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseFaviconOptions extends ConfigurableDocument {
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
  newIcon: ReadonlyRefOrGetter<string | null | undefined>,
  options?: UseFaviconOptions
): ComputedRef<string | null | undefined>
export function useFavicon(
  newIcon?: MaybeRef<string | null | undefined>,
  options?: UseFaviconOptions
): Ref<string | null | undefined>
export function useFavicon(
  newIcon: MaybeRefOrGetter<string | null | undefined> = null,
  options: UseFaviconOptions = {},
) {
  const {
    baseUrl = '',
    rel = 'icon',
    document = defaultDocument,
  } = options

  const favicon = toRef(newIcon)

  const applyIcon = (icon: string) => {
    const elements = document?.head
      .querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
    if (!elements || elements.length === 0) {
      const link = document?.createElement('link')
      if (link) {
        link.rel = rel
        link.href = `${baseUrl}${icon}`
        link.type = `image/${icon.split('.').pop()}`
        document?.head.append(link)
      }
      return
    }
    elements?.forEach(el => el.href = `${baseUrl}${icon}`)
  }

  watch(
    favicon,
    (i, o) => {
      if (typeof i === 'string' && i !== o)
        applyIcon(i)
    },
    { immediate: true },
  )

  return favicon
}

export type UseFaviconReturn = ReturnType<typeof useFavicon>
