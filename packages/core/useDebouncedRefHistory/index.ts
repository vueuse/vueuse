import { MaybeRef, debounceFilter } from '@vueuse/shared'
import { Ref } from 'vue-demi'
import { UseRefHistoryOptions, UseRefHistoryReturn, useRefHistory } from '../useRefHistory'

/**
 * Same as [useRefHistory](https://vueuse.org/useRefHistory) but with debounsed effect.
 *
 * @see https://vueuse.org/useDebouncedRefHistory
 * @param source
 * @param options
 * @param ms
 */
export function useDebouncedRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
  ms: MaybeRef<number>,
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = debounceFilter(ms)
  const history = useRefHistory(source, options, filter)

  return {
    ...history,
  }
}
