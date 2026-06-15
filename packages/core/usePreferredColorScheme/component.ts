import type { ColorSchemeType, ConfigurableWindow } from '@vueuse/core'
import type { ComputedRef, Reactive, SlotsType } from 'vue'
import { usePreferredColorScheme } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePreferredColorSchemeProps extends ConfigurableWindow {}
interface UsePreferredColorSchemeSlots {
  default: (data: Reactive<{
    colorScheme: ComputedRef<ColorSchemeType>
  }>) => any
}

export const UsePreferredColorScheme = /* #__PURE__ */ defineComponent<
  UsePreferredColorSchemeProps,
  Record<string, never>,
  string,
  SlotsType<UsePreferredColorSchemeSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      colorScheme: usePreferredColorScheme(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePreferredColorScheme',
    props: ['window'],
  },
)
