import type { MaybeComputedRef } from '@vueuse/shared'
import { isFunction, resolveUnref, until } from '@vueuse/shared'
import Schema from 'async-validator'
import type { Rules, ValidateError, ValidateOption } from 'async-validator'
import type { Ref } from 'vue-demi'
import { computed, isReactive, isRef, ref, watch } from 'vue-demi'

// @ts-expect-error Schema.default is exist in ssr mode
const AsyncValidatorSchema = Schema.default || Schema

export type AsyncValidatorError = Error & {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}

export interface ExecuteReturn {
  pass: boolean
  errorInfo: AsyncValidatorError | null
  errors: AsyncValidatorError['errors'] | undefined
  errorFields: AsyncValidatorError['fields'] | undefined
}

export interface UseAsyncValidatorReturn {
  pass: Ref<boolean>
  errorInfo: Ref<AsyncValidatorError | null>
  isFinished: Ref<boolean>
  errors: Ref<AsyncValidatorError['errors'] | undefined>
  errorFields: Ref<AsyncValidatorError['fields'] | undefined>
  execute: () => Promise<ExecuteReturn>
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
  const { validateOption = { }, immediate = true } = options

  const errorInfo = ref<AsyncValidatorError | null>(null)
  const isFinished = ref(false)
  const pass = ref(!immediate)
  const watchLock = ref(!immediate)
  const errors = computed(() => errorInfo.value?.errors || [])
  const errorFields = computed(() => errorInfo.value?.fields || {})

  const execute = async (): Promise<ExecuteReturn> => {
    watchLock.value = false
    isFinished.value = false
    pass.value = false
    const validator = new AsyncValidatorSchema(resolveUnref(rules))

    try {
      await validator.validate(resolveUnref(value), validateOption)
      pass.value = true
      errorInfo.value = null

      return {
        pass: true,
        errors: resolveUnref(errors),
        errorInfo: resolveUnref(errorInfo),
        errorFields: resolveUnref(errorFields),
      }
    }
    catch (err) {
      errorInfo.value = err as AsyncValidatorError

      return {
        pass: false,
        errorInfo: resolveUnref(errorInfo),
        errors: resolveUnref(errors),
        errorFields: resolveUnref(errorFields),
      }
    }
    finally {
      isFinished.value = true
    }
  }

  const shell = {
    isFinished,
    pass,
    errorInfo,
    errors,
    errorFields,
    execute,
  } as UseAsyncValidatorReturn

  watch(
    [
      isCouldWatch(value) ? value : () => value,
      isCouldWatch(rules) ? rules : () => rules,
    ],
    () => !watchLock.value && execute(),
    { immediate },
  )

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

function isCouldWatch(value: any) {
  return isRef(value) || isFunction(value) || isReactive(value)
}
