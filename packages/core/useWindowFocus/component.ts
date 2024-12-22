import { useWindowFocus } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UseWindowFocus = /* #__PURE__ */ defineComponent({
  name: 'UseWindowFocus',
  setup(props, { slots }) {
    const data = reactive({
      focused: useWindowFocus(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
