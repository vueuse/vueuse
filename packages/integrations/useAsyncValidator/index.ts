import type { MaybeRef } from '@vueuse/shared'
import { until } from '@vueuse/shared'
import Schema from 'async-validator'
import type { Rules, ValidateError } from 'async-validator'
import type { Ref } from 'vue-demi'
import { computed, ref, unref, watchEffect } from 'vue-demi'

type AsyncValidatorError = Error & {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}

interface UseAsyncValidatorReturn {
  pass: Ref<boolean>
  errorInfo: Ref<AsyncValidatorError | null>
  isFinished: Ref<boolean>
  errors: Ref<AsyncValidatorError['errors'] | undefined>
  errorFields: Ref<AsyncValidatorError['fields'] | undefined>
}

/**
 * Wrapper for async-validator.
 *
 * @see https://vueuse.org/useAsyncValidator
 */
export function useAsyncValidator(value: MaybeRef<Record<string, any>>, rules: MaybeRef<Rules>): UseAsyncValidatorReturn & PromiseLike<UseAsyncValidatorReturn> {
  const errorInfo = ref<AsyncValidatorError | null>()
  const isFinished = ref(false)
  const pass = ref(false)
  const errors = computed(() => errorInfo.value?.errors || [])
  const errorFields = computed(() => errorInfo.value?.fields || {})

  watchEffect(async () => {
    isFinished.value = false
    pass.value = false
    const validator = new Schema(unref(rules))
    try {
      await validator.validate(unref(value))
      pass.value = true
      errorInfo.value = null
    }
    catch (err) {
      errorInfo.value = err as AsyncValidatorError
    }
    finally {
      isFinished.value = true
    }
  })

  const shell = {
    pass,
    isFinished,
    errorInfo,
    errors,
    errorFields,
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
