import { resolveRef, resolveUnref } from '@vueuse/core'
import type { Ref, WatchCallback, WatchOptions } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'

/**
 * watch source value  update branchRef and  user can also modify branchRef value
 *
 * @param source source ref
 * @param options RefBranchOptions
 *
 */

interface RefBranchOptions<T> {
  watchOptions?: WatchOptions
  cb?: WatchCallback<T>
}
export function refBranch<T>(source: MaybeComputedRef<T>, options?: RefBranchOptions<T>): Ref<T> {
  const branchRef = ref<T>(resolveUnref(source)) as Ref<T>
  const update = (value: T) => {
    branchRef.value = value
  }
  const { watchOptions, cb = update } = options || {}
  watch(resolveRef(source), cb, watchOptions)
  return branchRef
}

