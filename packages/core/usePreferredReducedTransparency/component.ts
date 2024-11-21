import { defineComponent, reactive } from 'vue-demi'
import { usePreferredReducedTransparency } from '@vueuse/core'

export const UsePreferredReducedTransparency = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredReducedTransparency',
  setup(props, { slots }) {
    const data = reactive({
      transparency: usePreferredReducedTransparency(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
