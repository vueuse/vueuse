import { computed } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export function useMax(values: MaybeRef<number | MaybeRef<number>[]> | MaybeRef<number>[], maximum?: MaybeRef<number>) {
  const _defaultValue = computed(() => {
    let maxValue = null
    const _maximum = resolveUnref(maximum ?? Number.MAX_SAFE_INTEGER)
    const _values = resolveUnref<MaybeRef<number | MaybeRef<number>[]> | MaybeRef<number>[]>(values)
    if (Array.isArray(_values)) {
      const initailValues = _values.map(resolveUnref)
      maxValue = Math.min(Math.max(...initailValues), _maximum)
    }
    else {
      maxValue = Math.min(resolveUnref<number>(_values as number), _maximum)
    }
    return maxValue
  })

  return _defaultValue
}
