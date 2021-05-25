import { defineComponent, reactive, toRefs } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { useTimeAgo, TimeAgoOptions } from '@vueuse/core'

interface UseTimeAgoComponentOptions extends Omit<TimeAgoOptions<true>, 'controls'> {
  time: MaybeRef<Date | number | string>
}

export const UseTimeAgo = defineComponent<UseTimeAgoComponentOptions>({
  name: 'UseTimeAgo',
  props: ['time', 'updateInterval', 'max', 'fullDateFormatter', 'messages'] as unknown as undefined,
  setup(props, { slots }) {
    const { time } = toRefs(props)
    const data = reactive(useTimeAgo(time, { ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
