import type { MaybeRef } from '@vueuse/shared'
import { isString, resolveRef } from '@vueuse/shared'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue-demi'
import { watch } from 'vue-demi'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseFaviconOptions extends ConfigurableDocument {
  baseUrl?: string
  rel?: string
}

export type UseFaviconValue = string | null | undefined
export type UseFaviconGetter = () => UseFaviconValue

/**
 * Reactive favicon.
 *
 * @see https://vueuse.org/useFavicon
 * @param newIcon
 * @param options
 */
export function useFavicon(newIcon: ComputedRef<UseFaviconValue> | UseFaviconGetter, options?: UseFaviconOptions): ComputedRef<UseFaviconValue>
export function useFavicon(newIcon: MaybeRef<UseFaviconValue>, options?: UseFaviconOptions): Ref<UseFaviconValue>
export function useFavicon(newIcon?: ComputedRef<UseFaviconValue> | MaybeRef<UseFaviconValue> | UseFaviconGetter, options?: UseFaviconOptions): Ref<UseFaviconValue>
export function useFavicon(
  newIcon: ComputedRef<UseFaviconValue> | MaybeRef<UseFaviconValue> | UseFaviconGetter = null,
  options: UseFaviconOptions = {},
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

  return favicon as WritableComputedRef<string | null | undefined>
}
export type UseFaviconReturn = ReturnType<typeof useFavicon>
