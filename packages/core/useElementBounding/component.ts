import type { RenderableComponent, UseElementBoundingOptions, UseElementBoundingReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseElementBoundingProps extends UseElementBoundingOptions, RenderableComponent {}
interface UseElementBoundingSlots {
  default: (data: Reactive<UseElementBoundingReturn>) => any
}

export const UseElementBounding = /* #__PURE__ */ defineComponent<
  UseElementBoundingProps,
  Record<string, never>,
  string,
  SlotsType<UseElementBoundingSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLElement>()
    const data = reactive(useElementBounding(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseElementBounding',
    props: [
      'as',
      'immediate',
      'reset',
      'updateTiming',
      'windowResize',
      'windowScroll',
    ],
  },
)
