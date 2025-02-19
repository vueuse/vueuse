import { usePreferredContrast } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UsePreferredContrast = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredContrast',
  setup(props, { slots }) {
    const data = reactive({
      contrast: usePreferredContrast(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
