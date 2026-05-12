import type { UseGeolocationOptions, UseGeolocationReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useGeolocation } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseGeolocationProps extends UseGeolocationOptions {}
interface UseGeolocationSlots {
  default: (data: Reactive<UseGeolocationReturn>) => any
}

export const UseGeolocation = /* #__PURE__ */ defineComponent<
  UseGeolocationProps,
  Record<string, never>,
  string,
  SlotsType<UseGeolocationSlots>
>(
  (props, { slots }) => {
    const data = reactive(useGeolocation(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseGeolocation',
    props: [
      'enableHighAccuracy',
      'immediate',
      'maximumAge',
      'navigator',
      'timeout',
    ],
  },
)
