import { usePreferredColorScheme } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

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
