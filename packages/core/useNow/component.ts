import { defineComponent, reactive } from 'vue-demi'
import type { UseNowOptions } from '@vueuse/core'
import { useNow } from '@vueuse/core'

export const UseNow = /* #__PURE__ */ defineComponent<Omit<UseNowOptions<true>, 'controls'>>({
  name: 'UseNow',
  props: ['interval'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useNow({ ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
