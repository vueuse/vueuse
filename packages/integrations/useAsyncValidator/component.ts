import type { Rules } from 'async-validator'
import type { Reactive, SlotsType } from 'vue'
import type { UseAsyncValidatorOptions, UseAsyncValidatorReturn } from './index'
import { defineComponent, reactive } from 'vue'
import { useAsyncValidator } from './index'

export interface UseAsyncValidatorProps {
  form: Record<string, any>
  rules: Rules
  options?: UseAsyncValidatorOptions
}
interface UseAsyncValidatorSlots {
  default: (data: Reactive<UseAsyncValidatorReturn>) => any
}

export const UseAsyncValidator = /* #__PURE__ */ defineComponent<
  UseAsyncValidatorProps,
  Record<string, never>,
  string,
  SlotsType<UseAsyncValidatorSlots>
>(
  (props, { slots }) => {
    const data = reactive(useAsyncValidator(props.form, props.rules))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseAsyncValidator',
    props: [
      'form',
      'options',
      'rules',
    ],
  },
)
