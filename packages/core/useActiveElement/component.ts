import { useActiveElement } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

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
