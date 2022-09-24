import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref, until } from '@vueuse/shared'
import Schema from 'async-validator'
import type { Rules, ValidateError, ValidateOption } from 'async-validator'
import type { Ref } from 'vue-demi'
import { computed, ref, watchEffect } from 'vue-demi'

export type AsyncValidatorError = Error & {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}

export interface UseAsyncValidatorReturn {
  pass: Ref<boolean>
  errorInfo: Ref<AsyncValidatorError | null>
  isFinished: Ref<boolean>
  errors: Ref<AsyncValidatorError['errors'] | undefined>
  errorFields: Ref<AsyncValidatorError['fields'] | undefined>
}

export interface UseAsyncValidatorOptions {
  /**
   * @see https://github.com/yiminghe/async-validator#options
   */
  validateOption?: ValidateOption
}

/**
 * Wrapper for async-validator.
 *
 * @see https://vueuse.org/useAsyncValidator
 * @see https://github.com/yiminghe/async-validator
 */
export function useAsyncValidator(
  value: MaybeComputedRef<Record<string, any>>,
  rules: MaybeComputedRef<Rules>,
  options: UseAsyncValidatorOptions = {},
): UseAsyncValidatorReturn & PromiseLike<UseAsyncValidatorReturn> {
  const errorInfo = ref<AsyncValidatorError | null>()
  const isFinished = ref(false)
  const pass = ref(false)
  const errors = computed(() => errorInfo.value?.errors || [])
  const errorFields = computed(() => errorInfo.value?.fields || {})

  const { validateOption = {} } = options

  watchEffect(async () => {
    isFinished.value = false
    pass.value = false
    const validator = new Schema(resolveUnref(rules))
    try {
      await validator.validate(resolveUnref(value), validateOption)
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
