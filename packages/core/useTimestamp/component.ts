import type { UseTimestampOptions, UseTimestampReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useTimestamp } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseTimestampProps extends Omit<UseTimestampOptions<true>, 'controls'> {}
interface UseTimestampSlots {
  default: (data: Reactive<UseTimestampReturn>) => any
}

export const UseTimestamp = /* #__PURE__ */ defineComponent<
  UseTimestampProps,
  Record<string, never>,
  string,
  SlotsType<UseTimestampSlots>
>(
  (props, { slots }) => {
    const data = reactive(useTimestamp({ ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseTimestamp',
    props: [
      'callback',
      'immediate',
      'interval',
      'offset',
    ],
  },
)
