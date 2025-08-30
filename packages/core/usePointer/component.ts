import type { UsePointerOptions, UsePointerReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { defaultWindow, usePointer } from '@vueuse/core'
import { defineComponent, reactive, shallowRef } from 'vue'

export interface UsePointerProps extends Omit<UsePointerOptions, 'target'> {
  target?: 'window' | 'self'
}
interface UsePointerSlots {
  default: (data: Reactive<UsePointerReturn>) => any
}

export const UsePointer = /* #__PURE__ */ defineComponent<
  UsePointerProps,
  Record<string, never>,
  string,
  SlotsType<UsePointerSlots>
>(
  (props, { slots }) => {
    const el = shallowRef<HTMLElement | null>(null)

    const data = reactive(usePointer({
      ...props,
      target: props.target === 'self' ? el : defaultWindow,
    }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePointer',
    props: [
      'initialValue',
      'pointerTypes',
      'target',
      'window',
    ],
  },
)
