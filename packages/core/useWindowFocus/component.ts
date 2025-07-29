import type { ConfigurableWindow } from '@vueuse/core'
import type { Reactive, ShallowRef, SlotsType } from 'vue'
import { useWindowFocus } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseWindowFocusProps extends ConfigurableWindow {}
interface UseWindowFocusSlots {
  default: (data: Reactive<{
    focused: ShallowRef<boolean>
  }>) => any
}

export const UseWindowFocus = /* #__PURE__ */ defineComponent<
  UseWindowFocusProps,
  Record<string, never>,
  string,
  SlotsType<UseWindowFocusSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      focused: useWindowFocus(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseWindowFocus',
    props: ['window'],
  },
)
