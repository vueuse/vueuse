import type { MaybeRefOrGetter, Ref } from 'vue'
import type { MaybeComputedRefArgs } from '../utils'

import { isClient, tryOnMounted } from '@vueuse/shared'

import { shallowRef, watchEffect } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useMathRandom(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): Ref<number>
export function useMathRandom(...args: MaybeRefOrGetter<number>[]): Ref<number>

/**
 * Get a random integer from a set of numbers.
 * - If two numbers are provided, returns a random integer between them (inclusive)
 * - If more than two numbers are provided, randomly picks one from the array
 *
 * @see https://vueuse.org/useMathRandom
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useMathRandom(...args: MaybeComputedRefArgs<number>): Ref<number> {
  const current = shallowRef<number>(0)
  let mounted = false

  function compute(useRandom: boolean) {
    const values = toValueArgsFlat(args)

    // If exactly 2 numbers, return integer between them
    if (values.length === 2) {
      const min = Math.ceil(Math.min(values[0], values[1]))
      const max = Math.floor(Math.max(values[0], values[1]))
      if (useRandom) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      }
      // deterministic: choose midpoint
      return Math.floor((min + max) / 2)
    }

    // Otherwise, pick one from the array
    if (values.length > 0) {
      if (useRandom) {
        const randomIndex = Math.floor(Math.random() * values.length)
        return values[randomIndex]
      }
      // deterministic: choose first
      return values[0]
    }

    return 0
  }

  // initial deterministic value (for SSR and before mount)
  current.value = compute(false)

  // when mounted on client, mark mounted and set a random value
  tryOnMounted(() => {
    mounted = true
    // Only run on client runtime
    if (isClient)
      current.value = compute(true)
  })

  // re-evaluate when args change. Use deterministic value on server / before mount,
  // and random value on client after mount.
  watchEffect(() => {
    current.value = mounted && isClient ? compute(true) : compute(false)
  })

  return current
}
