import type { UseActiveElementOptions, UseActiveElementReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useActiveElement } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseActiveElementProps extends UseActiveElementOptions {}
interface UseActiveElementSlots {
  default: (data: Reactive<{ element: UseActiveElementReturn }>) => any
}

export const UseActiveElement = /* #__PURE__ */ defineComponent<
  UseActiveElementProps,
  Record<string, never>,
  string,
  SlotsType<UseActiveElementSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      element: useActiveElement(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseActiveElement',
    props: [
      'deep',
      'triggerOnRemoval',
      'window',
      'document',
    ],
  },
)
