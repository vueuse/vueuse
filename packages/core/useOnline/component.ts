import { defineComponent, reactive } from 'vue-demi'
import { useOnline } from '@vueuse/core'

export const UseOnline = /* #__PURE__ */ defineComponent({
  name: 'UseOnline',
  setup(props, { slots }) {
    const data = reactive({
      isOnline: useOnline(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
