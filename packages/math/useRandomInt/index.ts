import type { MaybeRefOrGetter, Ref } from 'vue'
import type { MaybeComputedRefArgs } from '../utils'
import { customRef } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useRandomInt(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): Ref<number>
export function useRandomInt(...args: MaybeRefOrGetter<number>[]): Ref<number>

/**
 * Get a random integer from a set of numbers.
 * - If two numbers are provided, returns a random integer between them (inclusive)
 * - If more than two numbers are provided, randomly picks one from the array
 *
 * @see https://vueuse.org/useRandomInt
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useRandomInt(...args: MaybeComputedRefArgs<number>): Ref<number> {
  return customRef((track, trigger) => ({
    get() {
      track()
      const values = toValueArgsFlat(args)

      // If exactly 2 numbers, return random integer between them
      if (values.length === 2) {
        const min = Math.ceil(Math.min(values[0], values[1]))
        const max = Math.floor(Math.max(values[0], values[1]))
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      // Otherwise, randomly pick one from the array
      if (values.length > 0) {
        const randomIndex = Math.floor(Math.random() * values.length)
        return values[randomIndex]
      }

      return 0
    },
    set() {
      // Read-only, trigger to force re-computation
      trigger()
    },
  }))
}
