import type { ConfigurableWindow, UseBrowserLocationReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useBrowserLocation } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

interface UseBrowserLocationProps extends ConfigurableWindow {}
interface UseBrowserLocationSlots {
  default: (data: Reactive<UseBrowserLocationReturn>) => any
}

export const UseBrowserLocation = /* #__PURE__ */ defineComponent<
  UseBrowserLocationProps,
  Record<string, never>,
  string,
  SlotsType<UseBrowserLocationSlots>
>(
  (props, { slots }) => {
    const data = reactive(useBrowserLocation(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseBrowserLocation',
    props: ['window'],
  },
)
