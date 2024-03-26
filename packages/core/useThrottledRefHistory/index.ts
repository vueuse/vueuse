import type { MaybeRef } from '@vueuse/shared'
import { throttleFilter } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory'
import { useRefHistory } from '../useRefHistory'

export type UseThrottledRefHistoryOptions<Raw, Serialized = Raw, Async extends boolean = false> = Omit<UseRefHistoryOptions<Raw, Serialized, Async>, 'eventFilter'> & { throttle?: MaybeRef<number>, trailing?: boolean }

export type UseThrottledRefHistoryReturn<Raw, Serialized = Raw, Async extends boolean = false> = UseRefHistoryReturn<Raw, Serialized, Async>

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw, Serialized = Raw, Async extends boolean = false>(
  source: Ref<Raw>,
  options: UseThrottledRefHistoryOptions<Raw, Serialized, Async> = {},
): UseThrottledRefHistoryReturn<Raw, Serialized, Async> {
  const { throttle = 200, trailing = true } = options
  const filter = throttleFilter(throttle, trailing)
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
