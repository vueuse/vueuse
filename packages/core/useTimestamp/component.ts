import { defineComponent, reactive } from 'vue-demi'
import type { UseTimestampOptions } from '@vueuse/core'
import { useTimestamp } from '@vueuse/core'

export const UseTimestamp = /* #__PURE__ */ defineComponent<Omit<UseTimestampOptions<true>, 'controls'>>({
  name: 'UseTimestamp',
  props: ['immediate', 'interval', 'offset'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useTimestamp({ ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
