import { defineComponent } from 'vue-demi'
import { useNow, UseNowOptions } from '.'

export const UseNow = defineComponent<{ options: UseNowOptions }>({
  name: 'UseNow',
  setup(props, { slots }) {
    const {
      isActive,
      now,
      pause,
      resume,
    } = useNow()

    return () => {
      if (slots.default) {
        return slots.default({
          isActive: isActive.value,
          now: now.value,
          pause,
          resume,
        })
      }
    }
  },
})
