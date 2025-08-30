import type { ElementSize, RenderableComponent, UseElementSizeReturn, UseResizeObserverOptions } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useElementSize } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef, toRefs, toValue } from 'vue'

export interface UseElementSizeProps extends Partial<ElementSize>, UseResizeObserverOptions, RenderableComponent {}
interface UseElementSizeSlots {
  default: (data: Reactive<UseElementSizeReturn>) => any
}

export const UseElementSize = /* #__PURE__ */ defineComponent<
  UseElementSizeProps,
  Record<string, never>,
  string,
  SlotsType<UseElementSizeSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const { width, height } = toRefs(props)
    const data = reactive(useElementSize(target, { width: toValue(width) ?? 0, height: toValue(height) ?? 0 }, {
      box: props.box,
      window: props.window,
    }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseElementSize',
    props: [
      'as',
      'box',
      'height',
      'width',
      'window',
    ],
  },
)
