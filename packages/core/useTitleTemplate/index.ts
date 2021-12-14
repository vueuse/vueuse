import { MaybeRef } from '@vueuse/shared'

import { computed } from 'vue-demi'

import { useTitle } from '../useTitle'

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
  titleTemplate: string,
) => {
  const title = useTitle(newTitle)

  // Replace the pre-defined string in the title template:
  const templatedTitle = computed(() => {
    return title.value ? (titleTemplate.includes('%s') ? titleTemplate.replace('%s', title.value) : title.value) : titleTemplate
  })

  return {
    title,
    templatedTitle,
  }
}

export type UseTitleTemplateReturn = ReturnType<typeof useTitleTemplate>
