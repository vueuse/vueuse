import { defineComponent, reactive } from 'vue-demi'
import { usePageLeave } from '@vueuse/core'

export const UsePageLeave = /* #__PURE__ */ defineComponent({
  name: 'UsePageLeave',
  setup(props, { slots }) {
    const data = reactive({
      isLeft: usePageLeave(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
