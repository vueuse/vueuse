import type { ShallowRef, WatchOptions, WatchSource } from 'vue'
import { shallowRef, watch } from 'vue'
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
export function useLastChanged(source: WatchSource, options?: UseLastChangedOptions<false>): ShallowRef<number | null>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<true> | UseLastChangedOptions<boolean, number>): ShallowRef<number>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, any> = {}): ShallowRef<number | null> | ShallowRef<number> {
  const ms = shallowRef<number | null>(options.initialValue ?? null)

  watch(
    source,
    () => ms.value = timestamp(),
    options,
  )

  return ms
}
