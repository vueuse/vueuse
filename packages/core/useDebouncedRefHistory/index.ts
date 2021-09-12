import { MaybeRef, debounceFilter } from '@vueuse/shared'
import { Ref } from 'vue-demi'
import { UseRefHistoryOptions, UseRefHistoryReturn, useRefHistory } from '../useRefHistory'

/**
 * Same as [useRefHistory](https://vueuse.org/useRefHistory) but with debounce effect.
 *
 * @see https://vueuse.org/useDebouncedRefHistory
 * @param source
 * @param options
 */
export function useDebouncedRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'filter'> & { debounce?: MaybeRef<number> } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = options.debounce ? debounceFilter(options.debounce) : undefined
  const history = useRefHistory(source, { ...options, filter })

  return {
    ...history,
  }
}
