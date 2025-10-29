import type { MousePressedOptions, RenderableComponent, UseMousePressedReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useMousePressed } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseMousePressedProps extends Omit<MousePressedOptions, 'target'>, RenderableComponent {}
interface UseMousePressedSlots {
  default: (data: Reactive<UseMousePressedReturn>) => any
}

export const UseMousePressed = /* #__PURE__ */ defineComponent<
  UseMousePressedProps,
  Record<string, never>,
  string,
  SlotsType<UseMousePressedSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(useMousePressed({ ...props, target }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseMousePressed',
    props: [
      'as',
      'capture',
      'drag',
      'initialValue',
      'onPressed',
      'onReleased',
      'touch',
      'window',
    ],
  },
)
