import type { MaybeRef } from '@vueuse/shared'
import { throttleFilter } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory'
import { useRefHistory } from '../useRefHistory'

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & { throttle?: MaybeRef<number>; trailing?: boolean } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const { throttle = 200, trailing = true } = options
  const filter = throttleFilter(throttle, trailing)
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
