import { defineComponent, reactive } from 'vue-demi'
import type { UseWindowSizeOptions } from '@vueuse/core'
import { useWindowSize } from '@vueuse/core'

export const UseWindowSize = /* #__PURE__ */ defineComponent<UseWindowSizeOptions>({
  name: 'UseWindowSize',
  props: ['initialWidth', 'initialHeight'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useWindowSize(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
