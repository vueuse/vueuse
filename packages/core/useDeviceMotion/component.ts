import { useDeviceMotion } from '@vueuse/core'
import { defineComponent } from 'vue'

export const UseDeviceMotion = /* #__PURE__ */ defineComponent({
  name: 'UseDeviceMotion',
  setup(props, { slots }) {
    const data = useDeviceMotion()

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
