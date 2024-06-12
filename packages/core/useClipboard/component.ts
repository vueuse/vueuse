import { defineComponent, reactive } from 'vue-demi'
import { useClipboard } from '@vueuse/core'
import type { UseClipboardOptions } from '@vueuse/core'

interface UseClipboardProps<Source = string> extends UseClipboardOptions<Source> {}

export const UseClipboard = /* #__PURE__ */ defineComponent<UseClipboardProps>({
  name: 'UseClipboard',
  props: [
    'source',
    'read',
    'navigator',
    'copiedDuring',
    'legacy',
  ] as unknown as undefined,

  setup(props, { slots }) {
    const data = reactive(useClipboard(props))

    return () => slots.default?.(data)
  },
})
