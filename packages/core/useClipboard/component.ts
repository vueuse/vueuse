import type { UseClipboardOptions, UseClipboardReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useClipboard } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseClipboardProps<Source = string> extends UseClipboardOptions<Source> {}
interface UseClipboardSlots {
  default: (data: Reactive<UseClipboardReturn<true>>) => any
}

export const UseClipboard = /* #__PURE__ */ defineComponent<
  UseClipboardProps,
  Record<string, never>,
  string,
  SlotsType<UseClipboardSlots>
>(
  (props, { slots }) => {
    const data = reactive(useClipboard(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseClipboard',
    props: [
      'source',
      'read',
      'navigator',
      'copiedDuring',
      'legacy',
    ],
  },
)
