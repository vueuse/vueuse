import { reactive, watchEffect } from 'vue-demi'
import type { WatchStopHandle } from 'vue-demi'
import type { IgnoredUpdater } from '@vueuse/shared'
import { watchIgnorable } from '@vueuse/shared'

type FormBuilder<Form extends {} = {}> = () => Form

type RuleItem = ((val: any) => boolean | string)
type FormRule = Record<string, RuleItem | RuleItem[]>
type FormStatus = Record<string, {
  /** 是否出错 */
  isError: boolean
  /** 错误信息 */
  message: string
  /** 立即进行校验 */
  verify: () => boolean
  /** 初始化规则校验 */
  init: () => void
  /** 重制规则校验 */
  clearError: () => void
  /** 忽略更新 */
  _ignoreUpdate: IgnoredUpdater
}>

export function useForm<FormT extends {}>(param: {
  form: FormBuilder<FormT>
  rule?: FormRule
}) {
  const { form: formBuilder, rule: FormRule } = param

  let initialForm = formBuilder()
  const form = reactive<FormT>(initialForm)

  const status = reactive({} as FormStatus)
  initStatus(status, form, FormRule)

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
    initialForm = formBuilder()
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        if (Object.prototype.hasOwnProperty.call(initialForm, key)) {
          status[key]._ignoreUpdate(() => {
            form[key] = (initialForm as any)[key] as any
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

function initStatus<FormT extends FormBuilder>(
  status: FormStatus,
  formObj: ReturnType<FormT>,
  formRule?: FormRule,
) {
  for (const key in formObj) {
    /** 用来停止 watchEffect 的句柄 */
    let stopEffect: WatchStopHandle | null = null

    // 当用户输入时开始校验
    const { ignoreUpdates } = watchIgnorable(() => formObj[key], init)

    status[key] = {
      message: '',
      isError: false,
      verify,
      clearError,
      init,
      _ignoreUpdate: ignoreUpdates,
    }

    // 初始化规则校验
    function init() {
      // 判断是否已经初始化过了
      if (stopEffect)
        return

      // 监听变化
      stopEffect = watchEffect(verify)
    }

    // 重制规则校验状态
    function clearError() {
      if (stopEffect) {
        stopEffect()
        stopEffect = null
      }
      status[key].message = ''
      status[key].isError = false
    }

    /** 进行校验 */
    function verify() {
      if (!formRule?.[key])
        return true

      // Functions or arrays of functions are allowed
      const formRuleItem = formRule[key]
      const rules = typeof formRuleItem === 'function'
        ? [formRuleItem]
        : formRuleItem

      // 遍历规则集，进行规则检查
      for (const rule of rules || []) {
        const result = rule(formObj[key])

        // result is false
        if (!result) {
          status[key].isError = true
          status[key].message = ''
          break
        }
        // result is string
        if (typeof result === 'string') {
          status[key].isError = true
          status[key].message = result
          break
        }
        status[key].isError = false
        status[key].message = ''
      }
      return !status[key].isError
    }
  }
}
