import { usePreferredReducedMotion } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UsePreferredReducedMotion = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredReducedMotion',
  setup(props, { slots }) {
    const data = reactive({
      motion: usePreferredReducedMotion(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
