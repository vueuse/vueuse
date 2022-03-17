import type { Ref } from 'vue-demi'
import { defineComponent, reactive, toRef } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { UseTimeAgoOptions } from '@vueuse/core'
import { useTimeAgo } from '@vueuse/core'

interface UseTimeAgoComponentOptions extends Omit<UseTimeAgoOptions<true>, 'controls'> {
  time: MaybeRef<Date | number | string>
}

export const UseTimeAgo = defineComponent<UseTimeAgoComponentOptions>({
  name: 'UseTimeAgo',
  props: ['time', 'updateInterval', 'max', 'fullDateFormatter', 'messages'] as unknown as undefined,
  setup(props, { slots }) {
    const time = toRef(props, 'time') as Ref<Date | number | string>
    const data = reactive(useTimeAgo(time, { ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
