import { defineComponent, h } from 'vue-demi'
import { useScreenSafeArea } from '.'

export const UseScreenSafeArea = /* #__PURE__ */ defineComponent({
  name: 'UseScreenSafeArea',
  props: {
    top: Boolean,
    right: Boolean,
    bottom: Boolean,
    left: Boolean,
  },
  setup(props, { slots }) {
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
})
