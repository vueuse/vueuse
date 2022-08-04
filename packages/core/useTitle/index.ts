import type { MaybeComputedRef, MaybeReadonlyRef, MaybeRef } from '@vueuse/shared'
import { isFunction, isString, resolveRef } from '@vueuse/shared'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue-demi'
import { unref, watch } from 'vue-demi'
import { useMutationObserver } from '../useMutationObserver'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseTitleOptions extends ConfigurableDocument {
  /**
   * Observe `document.title` changes using MutationObserve
   *
   * @default false
   */
  observe?: boolean
  /**
   * The template string to parse the title (e.g., '%s | My Website')
   *
   * @default '%s'
   */
  titleTemplate?: MaybeRef<string> | ((title: string) => string)
}

export function useTitle(
  newTitle?: MaybeReadonlyRef<string | null | undefined>,
  options?: UseTitleOptions,
): ComputedRef<string | null | undefined>

export function useTitle(
  newTitle?: MaybeRef<string | null | undefined>,
  options?: UseTitleOptions,
): Ref<string | null | undefined>

/**
 * Reactive document title.
 *
 * @see https://vueuse.org/useTitle
 * @param newTitle
 * @param options
 */
export function useTitle(
  newTitle: MaybeComputedRef<string | null | undefined> = null,
  options: UseTitleOptions = {},
) {
  const {
    document = defaultDocument,
    observe = false,
    titleTemplate = '%s',
  } = options

  const title: WritableComputedRef<string | null | undefined> = resolveRef(newTitle ?? document?.title ?? null)
  const isReadonly = newTitle && isFunction(newTitle)

  function format(t: string) {
    return isFunction(titleTemplate)
      ? titleTemplate(t)
      : unref(titleTemplate).replace('%s', t)
  }

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = format(t)
    },
    { immediate: true },
  )

  if (observe && document && !isReadonly) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = format(document.title)
      },
      { childList: true },
    )
  }

  return title
}

export type UseTitleReturn = ReturnType<typeof useTitle>
