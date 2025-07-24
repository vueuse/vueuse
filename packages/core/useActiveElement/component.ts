import type { UseActiveElementOptions } from './index'
import { defineComponent, reactive } from 'vue'
import { useActiveElement } from './index'

export const UseActiveElement = /* #__PURE__ */ defineComponent<UseActiveElementOptions>({
  name: 'UseActiveElement',
  props: [
    'deep',
    'triggerOnRemoval',
    'window',
    'document',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive({
      element: useActiveElement(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
