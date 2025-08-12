import type { ConfigurableNavigator, UseBatteryReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useBattery } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseBatteryProps extends ConfigurableNavigator {}
interface UseBatterySlots {
  default: (data: Reactive<UseBatteryReturn>) => any
}

export const UseBattery = /* #__PURE__ */ defineComponent<
  UseBatteryProps,
  Record<string, never>,
  string,
  SlotsType<UseBatterySlots>
>(
  (props, { slots }) => {
    const data = reactive(useBattery(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseBattery',
    props: ['navigator'],
  },
)
