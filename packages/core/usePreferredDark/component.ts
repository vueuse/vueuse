import type { ConfigurableWindow } from '@vueuse/core'
import type { ComputedRef, Reactive, SlotsType } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePreferredDarkProps extends ConfigurableWindow {}
interface UsePreferredDarkSlots {
  default: (data: Reactive<{
    prefersDark: ComputedRef<boolean>
  }>) => any
}

export const UsePreferredDark = /* #__PURE__ */ defineComponent<
  UsePreferredDarkProps,
  Record<string, never>,
  string,
  SlotsType<UsePreferredDarkSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      prefersDark: usePreferredDark(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePreferredDark',
    props: ['window'],
  },
)
