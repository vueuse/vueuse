import { useOnline } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

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
