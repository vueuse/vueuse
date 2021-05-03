import { defineComponent } from 'vue-demi'
import { useOnline } from '.'

export const UseOnline = defineComponent({
  name: 'UseOnline',
  setup(props, { slots }) {
    const isOnline = useOnline()

    return () => {
      if (slots.default) {
        return slots.default({
          isOnline: isOnline.value,
        })
      }
    }
  },
})
