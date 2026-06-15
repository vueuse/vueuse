import type { UseIdleOptions, UseIdleReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useIdle } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseIdleProps extends UseIdleOptions {
  timeout: number
}
interface UseIdleSlots {
  default: (data: Reactive<UseIdleReturn>) => any
}

export const UseIdle = /* #__PURE__ */ defineComponent<
  UseIdleProps,
  Record<string, never>,
  string,
  SlotsType<UseIdleSlots>
>(
  (props, { slots }) => {
    const data = reactive(useIdle(props.timeout, props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseIdle',
    props: [
      'eventFilter',
      'events',
      'initialState',
      'listenForVisibilityChange',
      'timeout',
      'window',
    ],
  },
)
