import type { Ref, WatchOptions, WatchSource } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { timestamp } from '../utils'

export interface UseLastChangedOptions<
  Immediate extends boolean,
  InitialValue extends number | null | undefined = undefined,
> extends WatchOptions<Immediate> {
  initialValue?: InitialValue
}

/**
 * Records the timestamp of the last change
 *
 * @see https://vueuse.org/useLastChanged
 */
export function useLastChanged(source: WatchSource, options?: UseLastChangedOptions<false>): Ref<number | null>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<true>): Ref<number>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, number>): Ref<number>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, any> = {}): Ref<number | null> | Ref<number> {
  const ms = ref<number | null>(options.initialValue ?? null)

  watch(
    source,
    () => ms.value = timestamp(),
    options,
  )

  return ms
}
