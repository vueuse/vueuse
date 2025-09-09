import type { MouseInElementOptions, RenderableComponent, UseMouseInElementReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseMouseInElementProps extends MouseInElementOptions, RenderableComponent {}
interface UseMouseInElementSlots {
  default: (data: Reactive<UseMouseInElementReturn>) => any
}

export const UseMouseInElement = /* #__PURE__ */ defineComponent<
  UseMouseInElementProps,
  Record<string, never>,
  string,
  SlotsType<UseMouseInElementSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(useMouseInElement(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseMouseInElement',
    props: [
      'as',
      'eventFilter',
      'handleOutside',
      'initialValue',
      'resetOnTouchEnds',
      'scroll',
      'target',
      'touch',
      'type',
      'window',
      'windowResize',
      'windowScroll',
    ],
  },
)
