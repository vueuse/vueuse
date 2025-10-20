import type { MaybeRefOrGetter, Ref } from 'vue'
// (no direct use of MaybeComputedRefArgs in this flexible overload)

import { isClient, tryOnMounted } from '@vueuse/shared'

import { shallowRef, watchEffect } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useRandom(...args: (MaybeRefOrGetter<number | string> | MaybeRefOrGetter<MaybeRefOrGetter<number | string>[]> | MaybeRefOrGetter<number>)[]): Ref<number | string | Array<number | string>>

/**
 * Get a random integer from a set of numbers or pick randomly from strings.
 * - If any string is provided, strings are used: if fewer than 2 strings -> returns 0,
 *   otherwise randomly picks one string from the provided strings.
 * - If only numbers are provided:
 *   - If two numbers are provided, returns a random integer between them (inclusive)
 *   - If more than two numbers are provided, randomly picks one from the array
 *
 * @see https://vueuse.org/useRandom
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useRandom(...args: any[]): Ref<number | string | Array<number | string> | undefined> {
  const current = shallowRef<number | string | Array<number | string> | undefined>(undefined)
  let mounted = false

  const resolve = (v: any) => (typeof v === 'function' ? v() : (v && Object.prototype.hasOwnProperty.call(v, 'value') ? v.value : v))

  function compute() {
    // Gather flat values first (we may need them for seed computation)
    const flatValues = toValueArgsFlat(args) as Array<number | string>

    // helper: hash a string to a 32-bit integer (FNV-1a)
    const hashFnv32a = (str: string) => {
      let h = 2166136261 >>> 0
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h = Math.imul(h, 16777619) >>> 0
      }
      return h >>> 0
    }

    // mulberry32 PRNG
    const mulberry32 = (a: number) => {
      return () => {
        let t = (a += 0x6D2B79F5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }

    // seed based on flatValues (stable, deterministic per component instance)
    const globalSeed = (typeof window !== 'undefined' && (window as any).__RANDOM_SEED__)
    const seedBase = globalSeed !== undefined ? globalSeed : hashFnv32a(JSON.stringify(flatValues))

    // Each component instance uses its own seedBase; no global state needed.
    // This ensures reproducibility and independence from render order.
    const gen = mulberry32(seedBase)
    const nextRand = () => gen()

    // Optional: allow native Math.random on client after mount via global flag
    const globalState: any = (typeof window !== 'undefined') ? (window as any) : undefined
    const useNative = isClient && mounted && (globalState && globalState.__VUEUSE_RANDOM_USE_NATIVE)

    // Detect array-first signature with optional count: if first arg resolves to array and second arg provided
    const firstResolved = args.length > 0 ? resolve(args[0]) : undefined
    const isArrayFirst = Array.isArray(firstResolved)
    const countArg = args.length > 1 ? resolve(args[1]) : undefined

    if (isArrayFirst) {
      const candidates = firstResolved as Array<number | string>
      const stringValues = candidates.filter(v => typeof v === 'string') as string[]
      const targetValues = stringValues.length > 0 ? stringValues : candidates as Array<number | string>

      const n = typeof countArg === 'number' && Number.isInteger(countArg) && countArg > 0 ? Math.max(1, Math.floor(countArg)) : undefined

      if (n !== undefined && n > 1) {
        if (stringValues.length > 0 && stringValues.length < 2)
          return undefined

        if (useNative) {
          // use native Math.random for client regenerations if flagged
          const copy = targetValues.slice()
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
              ;[copy[i], copy[j]] = [copy[j], copy[i]]
          }
          return copy.slice(0, Math.min(n, copy.length))
        }

        // use seeded shuffle
        const copy = targetValues.slice()
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(nextRand() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
        }
        return copy.slice(0, Math.min(n, copy.length))
      }

      if (targetValues.length === 0)
        return undefined

      if (useNative) {
        const idx = Math.floor(Math.random() * targetValues.length)
        return targetValues[idx]
      }

      // seeded single pick
      const idx = Math.floor(nextRand() * targetValues.length)
      return targetValues[idx]
    }

    // Fallback behavior when values passed as separate args
    const values = flatValues
    const strings = values.filter(v => typeof v === 'string') as string[]
    if (strings.length > 0) {
      if (strings.length < 2)
        return undefined

      if (useNative) {
        const idx = Math.floor(Math.random() * strings.length)
        return strings[idx]
      }

      const idx2 = Math.floor(nextRand() * strings.length)
      return strings[idx2]
    }

    const numericValues = values as number[]
    if (numericValues.length === 2) {
      const min = Math.ceil(Math.min(numericValues[0], numericValues[1]))
      const max = Math.floor(Math.max(numericValues[0], numericValues[1]))
      if (useNative) {
        const r = Math.floor(Math.random() * (max - min + 1)) + min
        return r
      }
      const r2 = Math.floor(nextRand() * (max - min + 1)) + min
      return r2
    }

    if (numericValues.length > 0) {
      if (useNative) {
        const randomIndex = Math.floor(Math.random() * numericValues.length)
        return numericValues[randomIndex]
      }
      const randomIndex2 = Math.floor(nextRand() * numericValues.length)
      return numericValues[randomIndex2]
    }

    return undefined
  }

  // initial deterministic value (for SSR and before mount)
  current.value = compute()

  // when mounted on client, mark mounted and set a random value
  tryOnMounted(() => {
    mounted = true
    // Only run on client runtime
    if (isClient)
      current.value = compute()
  })

  // re-evaluate when args change. Use deterministic value on server / before mount,
  // and random value on client after mount.
  watchEffect(() => {
    // after mounted we still call compute() which uses global mounted/isClient to decide seeded vs native
    current.value = compute()
  })

  return current
}
