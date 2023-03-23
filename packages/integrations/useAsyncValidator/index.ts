import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveRef, resolveUnref, until } from '@vueuse/shared'
import Schema from 'async-validator'
import type { Rules, ValidateError, ValidateOption } from 'async-validator'
import type { Ref } from 'vue-demi'
import { computed, ref, shallowRef, watch } from 'vue-demi'

// @ts-expect-error Schema.default is exist in ssr mode
const AsyncValidatorSchema = Schema.default || Schema

export type AsyncValidatorError = Error & {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}

export interface UseAsyncValidatorExecuteReturn {
  pass: boolean
  errors: AsyncValidatorError['errors'] | undefined
  errorInfo: AsyncValidatorError | null
  errorFields: AsyncValidatorError['fields'] | undefined
}

export interface UseAsyncValidatorReturn {
  pass: Ref<boolean>
  isFinished: Ref<boolean>
  errors: Ref<AsyncValidatorError['errors'] | undefined>
  errorInfo: Ref<AsyncValidatorError | null>
  errorFields: Ref<AsyncValidatorError['fields'] | undefined>
  execute: () => Promise<UseAsyncValidatorExecuteReturn>
}

export interface UseAsyncValidatorOptions {
  /**
   * @see https://github.com/yiminghe/async-validator#options
   */
  validateOption?: ValidateOption
  immediate?: boolean
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
  const {
    validateOption = {},
    immediate = true,
  } = options

  const valueRef = resolveRef(value)

  const errorInfo = shallowRef<AsyncValidatorError | null>(null)
  const isFinished = ref(true)
  const pass = ref(!immediate)
  const errors = computed(() => errorInfo.value?.errors || [])
  const errorFields = computed(() => errorInfo.value?.fields || {})

  const validator = computed(() => new AsyncValidatorSchema(resolveUnref(rules)))

  const execute = async (): Promise<UseAsyncValidatorExecuteReturn> => {
    isFinished.value = false
    pass.value = false

    try {
      await validator.value.validate(valueRef.value, validateOption)
      pass.value = true
      errorInfo.value = null
    }
    catch (err) {
      errorInfo.value = err as AsyncValidatorError
    }
    finally {
      isFinished.value = true
    }

    return {
      pass: pass.value,
      errorInfo: errorInfo.value,
      errors: errors.value,
      errorFields: errorFields.value,
    }
  }

  watch(
    [valueRef, validator],
    () => execute(),
    { immediate, deep: true },
  )

  const shell = {
    isFinished,
    pass,
    errors,
    errorInfo,
    errorFields,
    execute,
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
