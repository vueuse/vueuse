import type { MaybeRefOrGetter } from '@vueuse/shared'
import { debounceFilter } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory'
import { useRefHistory } from '../useRefHistory'

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with debounce filter.
 *
 * @see https://vueuse.org/useDebouncedRefHistory
 * @param source
 * @param options
 */
export function useDebouncedRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & { debounce?: MaybeRefOrGetter<number> } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = options.debounce ? debounceFilter(options.debounce) : undefined
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
