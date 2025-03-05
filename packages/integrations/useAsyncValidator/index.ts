import type { Rules, ValidateError, ValidateOption } from 'async-validator'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import { toRef, until } from '@vueuse/shared'
import Schema from 'async-validator'
import { computed, shallowRef, toValue, watch } from 'vue'

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
  pass: ShallowRef<boolean>
  isFinished: ShallowRef<boolean>
  errors: ComputedRef<AsyncValidatorError['errors'] | undefined>
  errorInfo: ShallowRef<AsyncValidatorError | null>
  errorFields: ComputedRef<AsyncValidatorError['fields'] | undefined>
  execute: () => Promise<UseAsyncValidatorExecuteReturn>
}

export interface UseAsyncValidatorOptions {
  /**
   * @see https://github.com/yiminghe/async-validator#options
   */
  validateOption?: ValidateOption
  /**
   * The validation will be triggered right away for the first time.
   * Only works when `manual` is not set to true.
   *
   * @default true
   */
  immediate?: boolean
  /**
   * If set to true, the validation will not be triggered automatically.
   */
  manual?: boolean
}

/**
 * Wrapper for async-validator.
 *
 * @see https://vueuse.org/useAsyncValidator
 * @see https://github.com/yiminghe/async-validator
 */
export function useAsyncValidator(
  value: MaybeRefOrGetter<Record<string, any>>,
  rules: MaybeRefOrGetter<Rules>,
  options: UseAsyncValidatorOptions = {},
): UseAsyncValidatorReturn & PromiseLike<UseAsyncValidatorReturn> {
  const {
    validateOption = {},
    immediate = true,
    manual = false,
  } = options

  const valueRef = toRef(value)

  const errorInfo = shallowRef<AsyncValidatorError | null>(null)
  const isFinished = shallowRef(true)
  const pass = shallowRef(!immediate || manual)
  const errors = computed(() => errorInfo.value?.errors || [])
  const errorFields = computed(() => errorInfo.value?.fields || {})

  const validator = computed(() => new AsyncValidatorSchema(toValue(rules)))

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

  if (!manual) {
    watch(
      [valueRef, validator],
      () => execute(),
      { immediate, deep: true },
    )
  }

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
      until(isFinished).toBe(true).then(() => resolve(shell)).catch(error => reject(error))
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
