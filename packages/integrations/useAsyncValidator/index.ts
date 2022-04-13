import type { MaybeRef } from '@vueuse/shared'
import { until } from '@vueuse/shared'
import Schema from 'async-validator'
import type { Rules, ValidateError } from 'async-validator'
import type { Ref } from 'vue-demi'
import { ref, unref, watchEffect } from 'vue-demi'

type AsyncValidatorError = Error & {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}

interface UseAsyncValidatorReturn {
  pass: Ref<boolean>
  error: Ref<AsyncValidatorError | null>
  isFinished: Ref<boolean>
}

/**
 * Wrapper for async-validator.
 *
 * @see https://vueuse.org/useAsyncValidator
 */
export function useAsyncValidator(value: MaybeRef<Record<string, any>>, rules: MaybeRef<Rules>): UseAsyncValidatorReturn & PromiseLike<UseAsyncValidatorReturn> {
  const error = ref<AsyncValidatorError | null>()
  const isFinished = ref(false)
  const pass = ref(false)

  watchEffect(async() => {
    isFinished.value = false
    const validator = new Schema(unref(rules))
    try {
      await validator.validate(unref(value))
      pass.value = true
      error.value = null
    }
    catch (err) {
      error.value = err as AsyncValidatorError
      pass.value = false
    }
    finally {
      isFinished.value = true
    }
  })

  const shell = {
    pass,
    isFinished,
    error,
  } as UseAsyncValidatorReturn

  function waitUntilFinished() {
    return new Promise<UseAsyncValidatorReturn>((resolve, reject) => {
      until(isFinished).toBe(true)
        .then(() => resolve(shell))
        .catch(error => reject(error))
    })
  }

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished()
        .then(onFulfilled, onRejected)
    },
  }
}
