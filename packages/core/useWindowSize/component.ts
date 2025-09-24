import type { UseWindowSizeOptions, UseWindowSizeReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseWindowSizeProps extends UseWindowSizeOptions {}
interface UseWindowSizeSlots {
  default: (data: Reactive<UseWindowSizeReturn>) => any
}

export const UseWindowSize = /* #__PURE__ */ defineComponent<
  UseWindowSizeProps,
  Record<string, never>,
  string,
  SlotsType<UseWindowSizeSlots>
>(
  (props, { slots }) => {
    const data = reactive(useWindowSize(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseWindowSize',
    props: [
      'includeScrollbar',
      'initialHeight',
      'initialWidth',
      'listenOrientation',
      'type',
      'window',
    ],
  },
)
