import { defineComponent } from 'vue-demi'
import { noop, UDate, isClient } from '@vueuse/shared'
import { useCountdown, UseCountDownOptions } from '@vueuse/core'

export const UseCountDown = defineComponent< {date: UDate} & UseCountDownOptions>({
  name: 'UseCountDown',
  props: ['date', 'interval', 'onEnd', 'format'] as unknown as undefined,
  setup(props, { slots }) {
    if (!isClient) return
    const data = useCountdown(props.date, {
      interval: props.interval ?? 1000,
      onEnd: props.onEnd ?? noop,
      format: props.format ?? 'HH:mm:ss',
    })
    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
