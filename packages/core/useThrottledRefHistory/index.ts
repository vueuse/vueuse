import { MaybeRef, throttleFilter } from '@vueuse/shared'
import { Ref } from 'vue-demi'
import { UseRefHistoryOptions, UseRefHistoryReturn, useRefHistory } from '../useRefHistory'

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & { throttle?: MaybeRef<number> } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = options.throttle ? throttleFilter(options.throttle) : undefined
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
