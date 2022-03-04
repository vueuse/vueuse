import type { MaybeRef } from '@vueuse/shared'
import { titleCase } from 'title-case'
import { computed, ref } from 'vue-demi'

/**
 *  Wrapper for title-case.
 *
 * @see https://vueuse.org/useTitleCase
 * @param input
 */
export function useTitleCase(
  input: MaybeRef<string>,
) {
  const text = ref(input)
  const result = computed<string>({
    get() {
      return titleCase(text.value)
    },
    set(value) {
      text.value = value
    },
  })
  return result
}
