import type { ConfigurableWindow } from '@vueuse/core'
import type { Reactive, Ref, SlotsType } from 'vue'
import { usePreferredLanguages } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePreferredLanguagesProps extends ConfigurableWindow {}
interface UsePreferredLanguagesSlots {
  default: (data: Reactive<{
    languages: Ref<readonly string[]>
  }>) => any
}

export const UsePreferredLanguages = /* #__PURE__ */ defineComponent<
  UsePreferredLanguagesProps,
  Record<string, never>,
  string,
  SlotsType<UsePreferredLanguagesSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      languages: usePreferredLanguages(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePreferredLanguages',
    props: ['window'],
  },
)
