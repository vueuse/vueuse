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
  updateControl?: (v: T, ov: T, onCleanup: any) => T
}

export function refBranch<T>(source: MaybeComputedRef<T>, defaults: MaybeComputedRef<T>, options?: RefBranchOptions<T>): Ref<T> {
  const branchRef = ref<T>(resolveUnref(source)) as Ref<T>
  const { watchOptions, updateControl } = options || {}
  const update: WatchCallback = (v, ov, onCleanup) => {
    if (updateControl && typeof updateControl === 'function')
      branchRef.value = updateControl(v, ov, onCleanup) ?? resolveUnref(defaults)
    else
      branchRef.value = v ?? resolveUnref(defaults)
  }
  watch(resolveRef(source), update, watchOptions)
  return branchRef
}

