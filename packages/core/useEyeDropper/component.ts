import { defineComponent, reactive } from 'vue-demi'
import { useEyeDropper } from '@vueuse/core'

export const UseEyeDropper = /* #__PURE__ */ defineComponent({
  name: 'UseEyeDropper',
  props: {
    sRGBHex: String,
  },
  setup(props, { slots }) {
    const data = reactive(useEyeDropper())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
