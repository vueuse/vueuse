import { defineComponent, reactive } from 'vue-demi'
import { usePointer, UsePointerOptions } from '@vueuse/core'

export const UsePointer = defineComponent<UsePointerOptions>({
  name: 'UsePointer',
  props: [
    'pointerTypes',
    'initialValue',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(usePointer(props))
    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
