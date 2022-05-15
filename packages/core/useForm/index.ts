import { computed, reactive, ref, watchEffect } from 'vue-demi'
import type { Ref, UnwrapNestedRefs, WatchStopHandle } from 'vue-demi'
import type { IgnoredUpdater } from '@vueuse/shared'
import { watchIgnorable } from '@vueuse/shared'

type FormBuilder<Form extends {} = {}> = () => Form

type RuleItem<ValueT = any> = ((val: ValueT) => boolean | string)
type FormRule<FormT extends {}> = {
  readonly [K in keyof FormT]?: RuleItem<FormT[K]> | RuleItem<FormT[K]>[]
}
type FormStatus = Record<string, {
  /** 是否出错 */
  isError: boolean
  /** 错误信息 */
  message: string
  /** field is modified */
  isDirty: boolean
  /** 立即进行校验 */
  verify: () => boolean
  /** 初始化规则校验 */
  init: () => void
  /** 设置错误 */
  setError: (message: string, isError?: boolean) => void
  /** 重制规则校验 */
  clearError: () => void
  /** 忽略更新 */
  _ignoreUpdate: IgnoredUpdater
}>

/**
 *  Form state management and validation
 * @see https://vueuse.org/useForm
 * @param param
 * @returns
 */
export function useForm<FormT extends {}>(param: {
  /** Initial form value */
  form: FormBuilder<FormT>
  /** Verification rules */
  rule?: FormRule<FormT>
}) {
  const { form: formBuilder, rule: FormRule } = param

  const initialForm = ref(formBuilder()) as Ref<FormT>
  const form = reactive<FormT>({ ...initialForm.value })

  const status = reactive({} as FormStatus)
  initStatus<FormT>(status, form, initialForm, FormRule)

  return {
    form,
    status,
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
  status: FormStatus,
  formObj: UnwrapNestedRefs<FormT>,
  initialForm: Ref<FormT>,
  formRule?: FormRule<FormT>,
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
