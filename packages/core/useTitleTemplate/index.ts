import { ref, watch } from 'vue-demi'
import { isString } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import { defaultDocument } from '../_configurable'
import type { ConfigurableDocument } from '../_configurable'
import { useMutationObserver } from '../useMutationObserver'

export interface UseTemplateTitleOptions extends ConfigurableDocument {
  /**
   * Observe `document.title` changes using MutationObserve
   *
   * @default false
   */
  observe?: boolean
  /**
   * The template string to parse the title
   *
   * @default '%s'
   */
  titleTemplate?: string
}

/**
 * Reactive document title with templated title, which follows the
 * Vue Meta / Nuxt convention of replacing a sub-string with title.
 *
 * @see https://vueuse.org/useTitleTemplate
 * @see https://vueuse.org/useTitle
 * @see https://vue-meta.nuxtjs.org/guide/metainfo.html
 *
 * @param newTitle of type MaybeRef string | null | undefined
 * @param titleTemplate of type string (e.g., '%s | My Website')
 * @returns
 */
export const useTitleTemplate = (
  newTitle: MaybeRef<string | null | undefined> = null,
  options: UseTemplateTitleOptions = {},
) => {
  const {
    document = defaultDocument,
    observe = false,
    titleTemplate = '%s',
  } = options

  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = titleTemplate.replace('%s', t)
    },
    { immediate: true },
  )

  if (observe && document) {
    useMutationObserver(
      document.head?.querySelector('title'),
      () => {
        if (document && document.title !== title.value)
          title.value = titleTemplate.replace('%s', document.title)
      },
      { childList: true },
    )
  }

  return title
}

export type UseTitleTemplateReturn = ReturnType<typeof useTitleTemplate>
