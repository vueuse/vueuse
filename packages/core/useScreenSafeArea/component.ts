import type { RenderableComponent, UseScreenSafeAreaReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useScreenSafeArea } from '@vueuse/core'
import { defineComponent, h, reactive } from 'vue'

export interface UseScreenSafeAreaProps extends RenderableComponent {
  top?: boolean
  right?: boolean
  bottom?: boolean
  left?: boolean
}

interface UseScreenSafeAreaSlots {
  default: (data: Reactive<UseScreenSafeAreaReturn>) => any
}

export const UseScreenSafeArea = /* #__PURE__ */ defineComponent<
  UseScreenSafeAreaProps,
  Record<string, never>,
  string,
  SlotsType<UseScreenSafeAreaSlots>
>(
  (props, { slots }) => {
    const data = reactive(useScreenSafeArea())

    return () => {
      if (slots.default) {
        return h(props.as || 'div', {
          style: {
            paddingTop: props.top ? data.top : '',
            paddingRight: props.right ? data.right : '',
            paddingBottom: props.bottom ? data.bottom : '',
            paddingLeft: props.left ? data.left : '',
            boxSizing: 'border-box',
            maxHeight: '100vh',
            maxWidth: '100vw',
            overflow: 'auto',
          },
        }, slots.default(data))
      }
    }
  },
  {
    name: 'UseScreenSafeArea',
    props: [
      'top',
      'right',
      'bottom',
      'left',
    ],
  },
)
