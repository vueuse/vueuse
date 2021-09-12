import { MaybeRef, throttleFilter } from '@vueuse/shared'
import { Ref } from 'vue-demi'
import { UseRefHistoryOptions, UseRefHistoryReturn, useRefHistory } from '../useRefHistory'

/**
 * Same as [useRefHistory](https://vueuse.org/useRefHistory) but with throttle effect.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'filter'> & { throttle?: MaybeRef<number> } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = options.throttle ? throttleFilter(options.throttle) : undefined
  const history = useRefHistory(source, { ...options, filter })

  return {
    ...history,
  }
}
