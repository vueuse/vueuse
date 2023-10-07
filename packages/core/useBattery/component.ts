import { defineComponent, reactive } from 'vue-demi'
import { useBattery } from '@vueuse/core'

export const UseBattery = /* #__PURE__ */ defineComponent({
  name: 'UseBattery',
  setup(props, { slots }) {
    const data = reactive(useBattery(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
