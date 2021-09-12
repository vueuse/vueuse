import { MaybeRef, throttleFilter } from '@vueuse/shared'
import { Ref } from 'vue-demi'
import { UseRefHistoryOptions, UseRefHistoryReturn, useRefHistory } from '../useRefHistory'

/**
 * Same as [useRefHistory](https://vueuse.org/useRefHistory) but with throttle effect.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 * @param ms
 */
export function useThrottledRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
  ms: MaybeRef<number>,
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = throttleFilter(ms)
  const history = useRefHistory(source, options, filter)

  return {
    ...history,
  }
}
