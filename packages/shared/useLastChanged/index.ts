import type { ShallowRef, WatchOptions, WatchSource } from 'vue'
import { shallowReadonly, shallowRef, watch } from 'vue'
import { timestamp } from '../utils'

export interface UseLastChangedOptions<
  Immediate extends boolean,
  InitialValue extends number | null | undefined = undefined,
> extends WatchOptions<Immediate> {
  initialValue?: InitialValue
}

export type UseLastChangedReturn = Readonly<ShallowRef<number | null>> | Readonly<ShallowRef<number>>

/**
 * Records the timestamp of the last change
 *
 * @see https://vueuse.org/useLastChanged
 */
export function useLastChanged(source: WatchSource, options?: UseLastChangedOptions<false>): Readonly<ShallowRef<number | null>>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<true> | UseLastChangedOptions<boolean, number>): Readonly<ShallowRef<number>>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, any> = {}): UseLastChangedReturn {
  const ms = shallowRef<number | null>(options.initialValue ?? null)

  watch(
    source,
    () => ms.value = timestamp(),
    options,
  )

  return shallowReadonly(ms)
}
