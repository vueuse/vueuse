import type { UseMouseOptions, UseMouseReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useMouse } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseMouseProps extends UseMouseOptions {}
interface UseMouseSlots {
  default: (data: Reactive<UseMouseReturn>) => any
}

export const UseMouse = /* #__PURE__ */ defineComponent<
  UseMouseProps,
  Record<string, never>,
  string,
  SlotsType<UseMouseSlots>
>(
  (props, { slots }) => {
    const data = reactive(useMouse(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseMouse',
    props: [
      'eventFilter',
      'initialValue',
      'resetOnTouchEnds',
      'scroll',
      'target',
      'touch',
      'type',
      'window',
    ],
  },
)
