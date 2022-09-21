import { defineComponent, reactive } from 'vue-demi'
import { usePreferredContrast } from '@vueuse/core'

export const UsePreferredContrast = defineComponent({
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
