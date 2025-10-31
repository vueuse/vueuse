// ported from https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j
// by @linusborg https://github.com/LinusBorg

import type { ShallowRef, WatchOptionsBase } from 'vue'
import { computed } from 'vue'

export type ComputedEagerOptions = WatchOptionsBase

export type ComputedEagerReturn<T = any> = Readonly<ShallowRef<T>>

/**
 *
 * @deprecated This function will be removed in future version.
 *
 * Note: If you are using Vue 3.4+, you can straight use computed instead.
 * Because in Vue 3.4+, if computed new value does not change,
 * computed, effect, watch, watchEffect, render dependencies will not be triggered.
 * refer: https://github.com/vuejs/core/pull/5912
 *
 * @deprecated - Replace with Vue's own computed function
 * @param fn effect function
 * @param _ WatchOptionsBase
 * @returns readonly shallowRef
 */
export function computedEager<T>(fn: () => T, _?: ComputedEagerOptions): ComputedEagerReturn<T> {
  return computed(fn)
}

/** @deprecated use `computedEager` instead */
export const eagerComputed = computedEager
