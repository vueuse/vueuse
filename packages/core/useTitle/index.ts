import type { MaybeComputedRef, MaybeReadonlyRef, MaybeRef } from '@vueuse/shared'
import { isFunction, isString, resolveRef } from '@vueuse/shared'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue-demi'
import { unref, watch } from 'vue-demi'
import { useMutationObserver } from '../useMutationObserver'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export type UseTitleOptionsBase =
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

export type UseTitleOptions = ConfigurableDocument & UseTitleOptionsBase

export function useTitle(
  newTitle: MaybeReadonlyRef<string | null | undefined>,
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
  /*
    `titleTemplate` that returns the modified input string will make
    the `document.title` to be different from the `title.value`,
    causing the title to update infinitely if `observe` is set to `true`.
  */
  const {
    document = defaultDocument,
  } = options

  const title: WritableComputedRef<string | null | undefined> = resolveRef(newTitle ?? document?.title ?? null)
  const isReadonly = newTitle && isFunction(newTitle)

  function format(t: string) {
    if (!('titleTemplate' in options))
      return t
    const template = options.titleTemplate || '%s'
    return isFunction(template)
      ? template(t)
      : unref(template).replace(/%s/g, t)
  }

  watch(
    title,
    (t, o) => {
      if (t !== o && document)
        document.title = format(isString(t) ? t : '')
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

  return title
}

export type UseTitleReturn = ReturnType<typeof useTitle>
