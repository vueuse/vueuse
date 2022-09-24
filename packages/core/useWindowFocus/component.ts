import { defineComponent, reactive } from 'vue-demi'
import { useWindowFocus } from '@vueuse/core'

export const UseWindowFocus = defineComponent({
  name: 'UseWindowFocus',
  setup(props, { slots }) {
    const data = reactive({
      focused: useWindowFocus(),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
