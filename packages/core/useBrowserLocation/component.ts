import { useBrowserLocation } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UseBrowserLocation = /* #__PURE__ */ defineComponent({
  name: 'UseBrowserLocation',
  setup(props, { slots }) {
    const data = reactive(useBrowserLocation())

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
