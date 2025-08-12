import type { UseEyeDropperOptions, UseEyeDropperReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useEyeDropper } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseEyeDropperProps extends UseEyeDropperOptions {}
interface UseEyeDropperSlots {
  default: (data: Reactive<UseEyeDropperReturn>) => any
}

export const UseEyeDropper = /* #__PURE__ */ defineComponent<
  UseEyeDropperProps,
  Record<string, never>,
  string,
  SlotsType<UseEyeDropperSlots>
>(
  (props, { slots }) => {
    const data = reactive(useEyeDropper(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseEyeDropper',
    props: ['initialValue'],
  },
)
