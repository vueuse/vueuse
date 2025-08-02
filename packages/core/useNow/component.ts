import type { UseNowOptions, UseNowReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useNow } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseNowProps extends Omit<UseNowOptions<true>, 'controls'> {}
interface UseNowSlots {
  default: (data: Reactive<UseNowReturn>) => any
}

export const UseNow = /* #__PURE__ */ defineComponent<
  UseNowProps,
  Record<string, never>,
  string,
  SlotsType<UseNowSlots>
>(
  (props, { slots }) => {
    const data = reactive(useNow({ ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseNow',
    props: [
      'immediate',
      'interval',
    ],
  },
)
