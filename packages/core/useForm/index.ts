import { computed, reactive, readonly, ref, watchEffect } from 'vue-demi'
import type { Ref, UnwrapNestedRefs, WatchStopHandle } from 'vue-demi'
import type { IgnoredUpdater } from '@vueuse/shared'
import { watchIgnorable } from '@vueuse/shared'

type RuleItem<ValueT = any> = ((val: ValueT) => boolean | string)
interface StatusItem {
  isError: boolean
  /** Error message */
  message: string
  /** Field is modified */
  isDirty: boolean
  /** Manual verify */
  verify: () => boolean
  init: () => void
  setError: (message: string, isError?: boolean) => void
  clearError: () => void

  _ignoreUpdate: IgnoredUpdater
}
type FormStatus<FormT extends {}> = {
  readonly [K in keyof FormT]: StatusItem
}

export type UseFormBuilder<Form extends {} = {}> = () => Form
export type UseFormRule<FormT extends {}> = {
  readonly [K in keyof FormT]?: RuleItem<FormT[K]> | RuleItem<FormT[K]>[]
}

export interface UseFormReturn<FormT> {
  /** form object */
  form: UnwrapNestedRefs<FormT>
  /** Form status */
  status: FormStatus<FormT>
  /** Manual verify */
  verify: () => boolean
  clearErrors: () => void
  /** Reset form  */
  reset: () => void
  /**
   * Submit form
   * Verify before submitting, and execute callback if passed
   */
  onSubmit: (callback: () => any) => any
}

/**
 *  Form state management and rule validation
 * @see https://vueuse.org/useForm
 * @param param Form and Rule object
 * @returns Form and Form Status
 */
export function useForm<FormT extends {}>(param: {
  /** Initial form value */
  form: UseFormBuilder<FormT>
  /** Verification rules */
  rule?: UseFormRule<FormT>
}): UseFormReturn<FormT> {
  const { form: formBuilder, rule: FormRule } = param

  const initialForm = ref(formBuilder()) as Ref<FormT>
  const form = reactive<FormT>({ ...initialForm.value })

  const status = reactive({} as Record<PropertyKey, StatusItem>)
  initStatus<FormT>(status, form, initialForm, FormRule)

  return {
    form,
    status: readonly(status) as any,
    verify,
    clearErrors,
    reset,
    onSubmit: (callback: () => any) => verify() ? callback() : null,
  }

  function verify() {
    let isPass = true
    Object.keys(status).forEach((key) => {
      isPass = isPass && status[key].verify()
    })
    return isPass
  }

  function clearErrors() {
    Object.keys(status).forEach((key) => {
      status[key].clearError()
    })
  }

  function reset() {
    initialForm.value = formBuilder()
    for (const key in form) {
      if (hasOwn(form, key)) {
        if (hasOwn(initialForm.value, key)) {
          status[key]._ignoreUpdate(() => {
            form[key] = (initialForm.value as any)[key] as any
          })
        }
        else {
          delete form[key]
        }
      }
    }
    clearErrors()
  }
}

function initStatus<FormT extends {}>(
  status: Record<PropertyKey, StatusItem>,
  formObj: UnwrapNestedRefs<FormT>,
  initialForm: Ref<FormT>,
  formRule?: UseFormRule<FormT>,
) {
  for (const key in formObj) {
    if (!hasOwn(formObj, key))
      continue

    /** Used to stop watchEffect */
    let stopEffect: WatchStopHandle | null = null

    // Begin validation when user input
    const { ignoreUpdates } = watchIgnorable(() => formObj[key], init)

    status[key] = reactive({
      message: '',
      isError: false,
      isDirty: computed(() => formObj[key] !== (initialForm.value as any)[key]),
      verify,
      setError,
      clearError,
      init,
      _ignoreUpdate: ignoreUpdates,
    })

    // Initialization rule check
    function init() {
      // Determine if it has been initialized
      if (stopEffect)
        return
      // monitor changes
      stopEffect = watchEffect(verify)
    }

    function setError(message: string, isError = true) {
      status[key].message = message
      status[key].isError = isError
    }

    function clearError() {
      if (stopEffect) {
        stopEffect()
        stopEffect = null
      }
      setError('', false)
    }

    function verify() {
      const fri: RuleItem | RuleItem[] = (formRule as any)?.[key]
      if (!fri)
        return true
      // Functions or arrays of functions are allowed
      const fieldRules = typeof fri === 'function' ? [fri] : fri

      // Traverse the ruleset and check the rules
      for (const rule of fieldRules || []) {
        const result = rule(formObj[key])

        // result as string or falsity
        // Exit validation on error
        if (!result || typeof result === 'string') {
          setError(result || '')
          break
        }
        // no errors
        else {
          setError('', false)
        }
      }
      return !status[key].isError
    }
  }
}

function hasOwn<T extends {}>(object: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(object, key)
}
