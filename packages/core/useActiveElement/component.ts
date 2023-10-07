import { defineComponent, reactive } from 'vue-demi'
import { useActiveElement } from '@vueuse/core'

export const UseActiveElement = /* #__PURE__ */ defineComponent({
  name: 'UseActiveElement',
  setup(props, { slots }) {
    const data = reactive({
      element: useActiveElement(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
