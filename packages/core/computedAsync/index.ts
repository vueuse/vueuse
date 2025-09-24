import type { Fn, WatchOptionFlush } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue'
import { noop } from '@vueuse/shared'
import {
  computed,
  ref as deepRef,
  isRef,
  shallowRef,
  watchEffect,
} from 'vue'

/**
 * Handle overlapping async evaluations.
 *
 * @param cancelCallback The provided callback is invoked when a re-evaluation of the computed value is triggered before the previous one finished
 */
export type AsyncComputedOnCancel = (cancelCallback: Fn) => void

export interface AsyncComputedOptions<Lazy = boolean> {
  /**
   * Should value be evaluated lazily
   *
   * @default false
   */
  lazy?: Lazy

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>

  /**
   * Use shallowRef
   *
   * @default true
   */
  shallow?: boolean

  /**
   * The flush option allows for greater control over the timing of a history point, default to `pre`
   *
   * Possible values: `pre`, `post`, `sync`
   *
   * It works in the same way as the flush option in watch and watch effect in vue reactivity
   * @default 'sync'
   */
  flush?: WatchOptionFlush

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void
}

/**
 * Create an asynchronous computed dependency.
 *
 * @see https://vueuse.org/computedAsync
 * @param evaluationCallback     The promise-returning callback which generates the computed value
 * @param initialState           The initial state, used until the first evaluation finishes
 * @param optionsOrRef           Additional options or a ref passed to receive the updates of the async evaluation
 */
export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState: T,
  optionsOrRef: AsyncComputedOptions<true>,
): ComputedRef<T>
export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState: undefined,
  optionsOrRef: AsyncComputedOptions<true>,
): ComputedRef<T | undefined>
export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState: T,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions,
): Ref<T>
export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: undefined,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions,
): Ref<T | undefined>
export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: T,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions,
): Ref<T> | Ref<T | undefined> | ComputedRef<T> | ComputedRef<T | undefined> {
  let options: AsyncComputedOptions

  if (isRef(optionsOrRef)) {
    options = {
      evaluating: optionsOrRef,
    }
  }
  else {
    options = optionsOrRef || {}
  }

  const {
    lazy = false,
    flush = 'sync',
    evaluating = undefined,
    shallow = true,
    onError = globalThis.reportError ?? noop,
  } = options

  const started = shallowRef(!lazy)
  const current = (shallow ? shallowRef(initialState) : deepRef(initialState)) as Ref<T>
  let counter = 0

  watchEffect(async (onInvalidate) => {
    if (!started.value)
      return

    counter++
    const counterAtBeginning = counter
    let hasFinished = false

    // Defer initial setting of `evaluating` ref
    // to avoid having it as a dependency
    if (evaluating) {
      Promise.resolve().then(() => {
        evaluating.value = true
      })
    }

    try {
      const result = await evaluationCallback((cancelCallback) => {
        onInvalidate(() => {
          if (evaluating)
            evaluating.value = false

          if (!hasFinished)
            cancelCallback()
        })
      })

      if (counterAtBeginning === counter)
        current.value = result
    }
    catch (e) {
      onError(e)
    }
    finally {
      if (evaluating && counterAtBeginning === counter)
        evaluating.value = false

      hasFinished = true
    }
  }, { flush })

  if (lazy) {
    return computed(() => {
      started.value = true
      return current.value
    })
  }
  else {
    return current
  }
}

/** @deprecated use `computedAsync` instead */
export const asyncComputed = computedAsync
