import type { Fn, MaybeRef, MaybeRefOrGetter, ReadonlyRefOrGetter } from '@vueuse/shared'
import { toRef, toValue, tryOnBeforeUnmount } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { watch } from 'vue-demi'
import { useMutationObserver } from '../useMutationObserver'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export type UseTitleOptionsBase = {
  /**
   * Stop watching the title when unmounted
   * @default true
   */
  stopOnUnmount?: boolean

  /**
   * Restore the original title when unmounted
   * @param originTitle original title
   * @returns restored title
   */
  restoreOnUnmount?: (originTitle: string) => string
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

export function useTitle(
  newTitle: ReadonlyRefOrGetter<string | null | undefined>,
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
  newTitle: MaybeRefOrGetter<string | null | undefined> = null,
  options: UseTitleOptions = {},
) {
  /*
    `titleTemplate` that returns the modified input string will make
    the `document.title` to be different from the `title.value`,
    causing the title to update infinitely if `observe` is set to `true`.
  */
  const {
    document = defaultDocument,
    restoreOnUnmount = t => t,
    stopOnUnmount = true,
  } = options
  const originalTitle = document?.title ?? ''
  const stops: (Fn)[] = []

  const title: Ref<string | null | undefined> = toRef(newTitle ?? document?.title ?? null)
  const isReadonly = newTitle && typeof newTitle === 'function'

  function format(t: string) {
    if (!('titleTemplate' in options))
      return t
    const template = options.titleTemplate || '%s'
    return typeof template === 'function'
      ? template(t)
      : toValue(template).replace(/%s/g, t)
  }

  stops.push(
    watch(
      title,
      (t, o) => {
        if (t !== o && document)
          document.title = format(typeof t === 'string' ? t : '')
      },
      { immediate: true },
    ),
  )

  if ((options as any).observe && !(options as any).titleTemplate && document && !isReadonly) {
    const observer = useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = format(document.title)
      },
      { childList: true },
    )
    stops.push(observer.stop)
  }

  tryOnBeforeUnmount(() => {
    title.value = restoreOnUnmount(originalTitle)
    stopOnUnmount && stops.forEach(s => s())
  })

  return title
}

export type UseTitleReturn = ReturnType<typeof useTitle>
