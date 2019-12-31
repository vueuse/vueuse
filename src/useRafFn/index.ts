import { Ref, watch } from '../api'
import { useRaf } from '../useRaf'

export function useRafFn (fn: (elapsed: Ref<number>) => any) {
  const elapsed = useRaf()

  watch(() => elapsed, fn)

  return elapsed
}
