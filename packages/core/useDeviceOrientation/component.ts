import { defineComponent, reactive } from 'vue-demi'
import { useDeviceOrientation } from '@vueuse/core'

export const UseDeviceOrientation = /* #__PURE__ */ defineComponent({
  name: 'UseDeviceOrientation',
  setup(props, { slots }) {
    const data = reactive(useDeviceOrientation())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
