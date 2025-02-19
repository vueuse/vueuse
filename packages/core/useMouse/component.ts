import type { UseMouseOptions } from '@vueuse/core'
import { useMouse } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export const UseMouse = /* #__PURE__ */ defineComponent<UseMouseOptions>({
  name: 'UseMouse',
  props: ['touch', 'resetOnTouchEnds', 'initialValue'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useMouse(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
