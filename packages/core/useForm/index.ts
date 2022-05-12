import { reactive, ref, watch, watchEffect } from 'vue-demi'
import type { Ref, WatchStopHandle } from 'vue-demi'

type Form = () => Record<string, any>

type RuleItem = ((val: any) => boolean | string)[]
type Ruler = () => Record<string, RuleItem>
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
}>

export function useForm<FormT extends Form>(param: {
  form: FormT
  rule: Ruler
}) {
  const { form, rule } = param
  const formRef = ref(form()) as Ref<ReturnType<FormT>>

  const status = reactive({} as FormStatus)
  initStatus(status, formRef, rule)

  return {
    form: formRef,
    status,
    verify,
    clearErrors,
    reset,
    onSubmit: (callback: () => any) => verify() ? callback() : null,
  }

  function verify() {
    let isPass = true
    Object.keys(status).forEach((key) => {
      isPass &&= status[key].verify()
    })
    return isPass
  }

  function clearErrors() {
    Object.keys(status).forEach((key) => {
      status[key].clearError()
    })
  }

  function reset() {
    formRef.value = form() as ReturnType<FormT>
    clearErrors()
  }
}

function initStatus<FormT extends Form>(
  status: FormStatus,
  formRef: Ref<ReturnType<FormT>>,
  ruler: Ruler,
) {
  const ruleObj = ruler()

  for (const key in formRef.value) {
    status[key] = {
      message: '',
      isError: false,
      verify,
      clearError,
      init,
    }

    /** 用来停止 watchEffect 的句柄 */
    let stopEffect: WatchStopHandle | null = null

    // 当用户输入时开始校验
    watch(() => formRef.value[key], init)

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
      const rules = ruleObj[key]
      // 遍历规则集，进行规则检查
      for (const rule of rules || []) {
        const result = rule(formRef.value[key])

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
