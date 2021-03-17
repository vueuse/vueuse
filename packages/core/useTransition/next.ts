import { computed, ComputedRef, ref, Ref, unref } from 'vue-demi'
import { isNumber, MaybeRef } from '@vueuse/shared'

// option 1: reactive number
export function useTransition(source: Ref<number>): ComputedRef<number>

// option 2: static array of possibly reactive numbers
export function useTransition<T extends MaybeRef<number>[]>(source: [...T]): ComputedRef<{ [K in keyof T]: number }>

// option 3: reactive array of numbers
export function useTransition<T extends Ref<number[]>>(source: T): ComputedRef<number[]>

/**
 * Transition between values.
 */
export function useTransition(
  source: Ref<number> | MaybeRef<number>[] | Ref<number[]>,
): ComputedRef<number | { [K in keyof typeof source]: number } | number[]> {
  // raw source value
  const sourceValue = computed(() => {
    const s = unref(source)
    return isNumber(s) ? s : s.map(unref) as number[]
  })

  // normalized source vector
  const sourceVector = computed(() => isNumber(sourceValue.value) ? [sourceValue.value] : sourceValue.value)

  return computed(() => isNumber(sourceValue.value) ? sourceVector.value[0] : sourceVector.value)
}

/* eslint-disable no-unused-expressions */
// option 1: number
useTransition(ref(1)).value

// option 2: [number, number, number]
useTransition([1, ref(2), computed(() => 2)]).value

// option 3: number[]
useTransition(ref([1, 2, 3])).value
