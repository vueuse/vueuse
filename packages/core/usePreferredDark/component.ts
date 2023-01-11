import { defineComponent, reactive } from 'vue-demi'
import { usePreferredDark } from '@vueuse/core'

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
