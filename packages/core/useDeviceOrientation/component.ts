import type { ConfigurableWindow, UseDeviceOrientationReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useDeviceOrientation } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseDeviceOrientationProps extends ConfigurableWindow {}
interface UseDeviceOrientationSlots {
  default: (data: Reactive<UseDeviceOrientationReturn>) => any
}

export const UseDeviceOrientation = /* #__PURE__ */ defineComponent<
  UseDeviceOrientationProps,
  Record<string, never>,
  string,
  SlotsType<UseDeviceOrientationSlots>
>(
  (props, { slots }) => {
    const data = reactive(useDeviceOrientation(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseDeviceOrientation',
    props: ['window'],
  },
)
