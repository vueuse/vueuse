import type { ConfigurableWindow, UseDevicePixelRatioReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useDevicePixelRatio } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseDevicePixelRatioProps extends ConfigurableWindow {}
interface UseDevicePixelRatioSlots {
  default: (data: Reactive<UseDevicePixelRatioReturn>) => any
}

export const UseDevicePixelRatio = /* #__PURE__ */ defineComponent<
  UseDevicePixelRatioProps,
  Record<string, never>,
  string,
  SlotsType<UseDevicePixelRatioSlots>
>(
  (props, { slots }) => {
    const data = reactive(useDevicePixelRatio(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseDevicePixelRatio',
    props: ['window'],
  },
)
