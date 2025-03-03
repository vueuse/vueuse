import type { ReadonlyRefOrGetter } from '@vueuse/shared'
import type { ComputedRef, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { toRef, tryOnScopeDispose } from '@vueuse/shared'
import { toValue, watch } from 'vue'
import { defaultDocument } from '../_configurable'
import { useMutationObserver } from '../useMutationObserver'

export type UseTitleOptionsBase = {
  /**
   * Restore the original title when unmounted
   * @param originTitle original title
   * @returns restored title
   */
  restoreOnUnmount?: false | ((originalTitle: string, currentTitle: string) => string | null | undefined)
} & (
  {
    /**
     * Observe `document.title` changes using MutationObserve
     * Cannot be used together with `titleTemplate` option.
     *
     * @default false
     */
    observe?: boolean
  }
  | {
    /**
     * The template string to parse the title (e.g., '%s | My Website')
     * Cannot be used together with `observe` option.
     *
     * @default '%s'
     */
    titleTemplate?: MaybeRef<string> | ((title: string) => string)
  }
)

export type UseTitleOptions = ConfigurableDocument & UseTitleOptionsBase

/**
 * Reactive document title.
 *
 * @see https://vueuse.org/useTitle
 * @param newTitle
 * @param options
 * @description It's not SSR compatible. Your value will be applied only on client-side.
 */
export function useTitle(
  newTitle: ReadonlyRefOrGetter<string | null | undefined>,
  options?: UseTitleOptions,
): ComputedRef<string | null | undefined>
export function useTitle(
  newTitle?: MaybeRef<string | null | undefined>,
  options?: UseTitleOptions,
): Ref<string | null | undefined>
export function useTitle(
  newTitle: MaybeRefOrGetter<string | null | undefined> = null,
  options: UseTitleOptions = {},
) {
  const {
    document = defaultDocument,
    restoreOnUnmount = t => t,
  } = options
  const originalTitle = document?.title ?? ''

  const title = toRef(newTitle ?? document?.title ?? null)
  const isReadonly = !!(newTitle && typeof newTitle === 'function')

  function format(t: string) {
    if (!('titleTemplate' in options))
      return t
    const template = options.titleTemplate || '%s'
    return typeof template === 'function'
      ? template(t)
      : toValue(template).replace(/%s/g, t)
  }

  watch(
    title,
    (newValue, oldValue) => {
      if (newValue !== oldValue && document)
        document.title = format(newValue ?? '')
    },
    { immediate: true },
  )

  if ((options as any).observe && !(options as any).titleTemplate && document && !isReadonly) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = format(document.title)
      },
      { childList: true },
    )
  }

  tryOnScopeDispose(() => {
    if (restoreOnUnmount) {
      const restoredTitle = restoreOnUnmount(originalTitle, title.value || '')
      if (restoredTitle != null && document)
        document.title = restoredTitle
    }
  })

  return title
}

export type UseTitleReturn = ReturnType<typeof useTitle>
