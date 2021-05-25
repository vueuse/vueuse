import { defineComponent, reactive } from 'vue-demi'
import { useDeviceLight } from '@vueuse/core'

export const UseDeviceLight = defineComponent({
  name: 'UseDeviceLight',
  setup(props, { slots }) {
    const data = reactive({
      light: useDeviceLight(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
