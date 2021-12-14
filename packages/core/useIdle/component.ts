import { defineComponent, reactive } from 'vue-demi'
import type { IdleOptions } from '@vueuse/core'
import { useIdle } from '@vueuse/core'

export const UseIdle = defineComponent<IdleOptions & { timeout: number }>({
  name: 'UseIdle',
  props: ['timeout', 'events', 'listenForVisibilityChange', 'initialState'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useIdle(props.timeout, props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
