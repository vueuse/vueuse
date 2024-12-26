import { usePreferredDark } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UsePreferredDark = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredDark',
  setup(props, { slots }) {
    const data = reactive({
      prefersDark: usePreferredDark(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
