import type { ConfigurableWindow, UseNetworkReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useOnline } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseOnlineProps extends ConfigurableWindow {}
interface UseOnlineSlots {
  default: (data: Reactive<{
    isOnline: UseNetworkReturn['isOnline']
  }>) => any
}

export const UseOnline = /* #__PURE__ */ defineComponent<
  UseOnlineProps,
  Record<string, never>,
  string,
  SlotsType<UseOnlineSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      isOnline: useOnline(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseOnline',
    props: ['window'],
  },
)
