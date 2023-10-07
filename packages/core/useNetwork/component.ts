import { defineComponent, reactive } from 'vue-demi'
import { useNetwork } from '@vueuse/core'

export const UseNetwork = /* #__PURE__ */ defineComponent({
  name: 'UseNetwork',
  setup(props, { slots }) {
    const data = reactive(useNetwork())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
