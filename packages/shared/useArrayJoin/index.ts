import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export function useArrayJoin(
  list: MaybeComputedRef<MaybeComputedRef<any>[]>,
  separator?: MaybeComputedRef<string>,
): ComputedRef<string> {
  return computed(() => resolveUnref(list).map(i => resolveUnref(i)).join(resolveUnref(separator)))
}
