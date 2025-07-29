import { useScreenSafeArea } from '@vueuse/core'
import { defineComponent, h } from 'vue'

export interface UseScreenSafeAreaProps {
  top?: boolean
  right?: boolean
  bottom?: boolean
  left?: boolean
}

export const UseScreenSafeArea = /* #__PURE__ */ defineComponent<UseScreenSafeAreaProps>(
  (props, { slots }) => {
    const {
      top,
      right,
      bottom,
      left,
    } = useScreenSafeArea()

    return () => {
      if (slots.default) {
        return h('div', {
          style: {
            paddingTop: props.top ? top.value : '',
            paddingRight: props.right ? right.value : '',
            paddingBottom: props.bottom ? bottom.value : '',
            paddingLeft: props.left ? left.value : '',
            boxSizing: 'border-box',
            maxHeight: '100vh',
            maxWidth: '100vw',
            overflow: 'auto',
          },
        }, slots.default())
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
