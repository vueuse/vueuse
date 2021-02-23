import { timestamp } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useRafFn } from '../useRafFn'

export interface TimestampOptions {
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number
}

/**
 * Reactive current timestamp.
 *
 * @see   {@link https://vueuse.org/useTimestamp}
 * @param options
 */
export function useTimestamp(options: TimestampOptions = {}) {
  const { offset = 0 } = options

  const ts = ref(timestamp() + offset)

  const controls = useRafFn(
    () => ts.value = timestamp() + offset,
    { immediate: true },
  )

  return {
    timestamp: ts,
    ...controls,
  }
}
