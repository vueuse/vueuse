import { defineComponent, reactive } from 'vue-demi'
import { useDeviceMotion } from '.'

export const UseDeviceMotion = defineComponent({
  name: 'UseDeviceMotion',
  setup(props, { slots }) {
    const data = reactive(useDeviceMotion())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
