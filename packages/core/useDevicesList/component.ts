import type { UseDevicesListOptions, UseDevicesListReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useDevicesList } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseDevicesListProps extends UseDevicesListOptions {}
interface UseDevicesListSlots {
  default: (data: Reactive<UseDevicesListReturn>) => any
}

export const UseDevicesList = /* #__PURE__ */ defineComponent<
  UseDevicesListProps,
  Record<string, never>,
  string,
  SlotsType<UseDevicesListSlots>
>(
  (props, { slots }) => {
    const data = reactive(useDevicesList(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseDevicesList',
    props: [
      'constraints',
      'navigator',
      'onUpdated',
      'requestPermissions',
    ],
  },
)
