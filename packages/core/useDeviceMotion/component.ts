import { defineComponent, reactive } from 'vue-demi'
import { useDeviceMotion } from '@vueuse/core'

export const UseDeviceMotion = /* #__PURE__ */ defineComponent({
  name: 'UseDeviceMotion',
  setup(props, { slots }) {
    const data = reactive(useDeviceMotion())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
