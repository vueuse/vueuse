import type { RenderableComponent, UseElementSizeOptions, UseElementSizeReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useElementSize } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseElementSizeProps extends UseElementSizeOptions, RenderableComponent {
  /**
   * @deprecated Use `initials.width` instead. Will be removed in v17.
   */
  width?: number
  /**
   * @deprecated Use `initials.height` instead. Will be removed in v17.
   */
  height?: number
}
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
    const data = reactive(useElementSize(target, {
      box: props.box,
      window: props.window,
      initials: {
        width: props.initials?.width ?? props.width,
        height: props.initials?.height ?? props.height,
      },
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
      'initials',
      'width',
      'window',
    ],
  },
)
