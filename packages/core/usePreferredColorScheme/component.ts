import { defineComponent, reactive } from 'vue-demi'
import { usePreferredColorScheme } from '@vueuse/core'

export const UsePreferredColorScheme = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredColorScheme',
  setup(props, { slots }) {
    const data = reactive({
      colorScheme: usePreferredColorScheme(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
