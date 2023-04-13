import type { Fn } from '@vueuse/shared'
import { noop } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, isRef, ref, shallowRef, watchEffect } from 'vue-demi'

/**
 * Handle overlapping async evaluations.
 *
 * @param cancelCallback The provided callback is invoked when a re-evaluation of the computed value is triggered before the previous one finished
 */
export type AsyncComputedOnCancel = (cancelCallback: Fn) => void

export interface AsyncComputedOptions {
  /**
   * Should value be evaluated lazily
   *
   * @default false
   */
  lazy?: boolean

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
  initialState?: T,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions,
): Ref<T> {
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
    evaluating = undefined,
    shallow = true,
    onError = noop,
  } = options

  const started = ref(!lazy)
  const current = (shallow ? shallowRef(initialState) : ref(initialState)) as Ref<T>
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
  })

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

// alias
export { computedAsync as asyncComputed }
