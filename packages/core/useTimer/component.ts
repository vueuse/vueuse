import { defineComponent, reactive } from 'vue-demi'
import type { MaybeRef, UseTimerOptions } from '@vueuse/core'
import { useTimer } from '@vueuse/core'

export interface UseTimerProps {
  /**
   * Start seconds on the timer
   */
  startSeconds: MaybeRef<number>
  /**
   * useTimer options
   *
   * @default {}
   */
  options: Omit<UseTimerOptions<true>, 'controls' | 'onTimerEnd'>
}

export const UseTimer = defineComponent<UseTimerProps>({
  name: 'UseTimer',
  props: ['startSeconds', 'immediate', 'format'] as unknown as undefined,
  emits: ['timerEnd'],
  setup(props, { slots, emit }) {
    const data = reactive(useTimer(props.startSeconds, ({
      ...props,
      controls: true,
      onTimerEnd: () => {
        emit('timerEnd')
      },
    })))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
