import { Fn } from '@vueuse/shared'
import { ref, watchEffect, Ref } from 'vue-demi'

/**
 * Handle overlapping async evaluations
 *
 * @param cancelCallback The provided callback is invoked when a re-evaluation of the computed value is triggered before the previous one finished
 */
export type AsyncComputedOnCancel = (cancelCallback: Fn) => void

/**
 * Create an asynchronous computed dependency
 *
 * @see   {@link https://vueuse.js.org/asyncComputed}
 * @param evaluationCallback     The promise-returning callback which generates the computed value
 * @param initialState           The initial state, used until the first evaluation finishes
 * @param evaluatingRef          A ref passed to received the updates of the async evaluation
 */
export function asyncComputed<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: T,
  evaluatingRef?: Ref<boolean>,
): Ref<T> {
  let counter = 0
  const current = ref(initialState) as Ref<T>

  watchEffect(async(onInvalidate) => {
    counter++
    const counterAtBeginning = counter
    let hasFinished = false

    try {
      // Defer initial setting of `evaluating` ref
      // to avoid having it as a dependency
      if (evaluatingRef) {
        Promise.resolve().then(() => {
          evaluatingRef.value = true
        })
      }

      const result = await evaluationCallback((cancelCallback) => {
        onInvalidate(() => {
          if (evaluatingRef)
            evaluatingRef.value = false

          if (!hasFinished)
            cancelCallback()
        })
      })

      if (counterAtBeginning === counter)
        current.value = result
    }
    finally {
      if (evaluatingRef)
        evaluatingRef.value = false
      hasFinished = true
    }
  })

  return current
}
