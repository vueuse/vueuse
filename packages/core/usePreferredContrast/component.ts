import type { ConfigurableWindow, ContrastType } from '@vueuse/core'
import type { ComputedRef, Reactive, SlotsType } from 'vue'
import { usePreferredContrast } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePreferredContrastProps extends ConfigurableWindow {}
interface UsePreferredContrastSlots {
  default: (data: Reactive<{
    contrast: ComputedRef<ContrastType>
  }>) => any
}

export const UsePreferredContrast = /* #__PURE__ */ defineComponent<
  UsePreferredContrastProps,
  Record<string, never>,
  string,
  SlotsType<UsePreferredContrastSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      contrast: usePreferredContrast(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePreferredContrast',
    props: ['window'],
  },
)
