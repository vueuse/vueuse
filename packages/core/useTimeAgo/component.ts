import type { UseTimeAgoOptions, UseTimeAgoReturn } from '@vueuse/core'
import type { MaybeRef, Reactive, SlotsType } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseTimeAgoProps extends Omit<UseTimeAgoOptions<true>, 'controls'> {
  time: MaybeRef<Date | number | string>
}
interface UseTimeAgoSlots {
  default: (data: Reactive<UseTimeAgoReturn<true>>) => any
}

export const UseTimeAgo = /* #__PURE__ */ defineComponent<
  UseTimeAgoProps,
  Record<string, never>,
  string,
  SlotsType<UseTimeAgoSlots>
>(
  (props, { slots }) => {
    const data = reactive(useTimeAgo(() => props.time as number, { ...props, controls: true }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseTimeAgo',
    props: [
      'fullDateFormatter',
      'max',
      'messages',
      'rounding',
      'showSecond',
      'time',
      'units',
      'updateInterval',
    ],
  },
)
