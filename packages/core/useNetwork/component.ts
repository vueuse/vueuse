import type { ConfigurableWindow, UseNetworkReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useNetwork } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseNetworkProps extends ConfigurableWindow {}
interface UseNetworkSlots {
  default: (data: Reactive<UseNetworkReturn>) => any
}

export const UseNetwork = /* #__PURE__ */ defineComponent<
  UseNetworkProps,
  Record<string, never>,
  string,
  SlotsType<UseNetworkSlots>
>(
  (props, { slots }) => {
    const data = reactive(useNetwork(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseNetwork',
    props: ['window'],
  },
)
