import { defineComponent, reactive } from 'vue-demi'
import { useBrowserLocation } from '@vueuse/core'

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
