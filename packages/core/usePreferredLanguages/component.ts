import { defineComponent, reactive } from 'vue-demi'
import { usePreferredLanguages } from '@vueuse/core'

export const UsePreferredLanguages = /* #__PURE__ */ defineComponent({
  name: 'UsePreferredLanguages',
  setup(props, { slots }) {
    const data = reactive({
      languages: usePreferredLanguages(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
