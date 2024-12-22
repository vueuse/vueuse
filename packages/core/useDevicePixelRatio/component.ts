import { useDevicePixelRatio } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UseDevicePixelRatio = /* #__PURE__ */ defineComponent({
  name: 'UseDevicePixelRatio',
  setup(props, { slots }) {
    const data = reactive({
      pixelRatio: useDevicePixelRatio(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
