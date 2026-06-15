import type { DeviceMotionOptions, UseDeviceMotionReturn } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { useDeviceMotion } from '@vueuse/core'
import { defineComponent } from 'vue'

export interface UseDeviceMotionProps extends DeviceMotionOptions {}
interface UseDeviceMotionSlots {
  default: (data: UseDeviceMotionReturn) => any
}

export const UseDeviceMotion = /* #__PURE__ */ defineComponent<
  UseDeviceMotionProps,
  Record<string, never>,
  string,
  SlotsType<UseDeviceMotionSlots>
>(
  (props, { slots }) => {
    const data = useDeviceMotion(props)

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseDeviceMotion',
    props: [
      'eventFilter',
      'requestPermissions',
      'window',
    ],
  },
)
