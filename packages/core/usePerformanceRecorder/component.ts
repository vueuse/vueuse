import { defineComponent, reactive } from 'vue-demi'
import { usePerformanceRecorder } from '@vueuse/core'

export const UsePerformanceRecorder = /* #__PURE__ */ defineComponent({
  name: 'UsePerformanceRecorder',
  setup(props, { slots }) {
    const data = reactive({
      recorderInfo: usePerformanceRecorder(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
