import { defineComponent, reactive, ref } from 'vue-demi'
import type { UsePointerOptions } from '@vueuse/core'
import { usePointer } from '@vueuse/core'
import { defaultWindow } from '../_configurable'

export const UsePointer = /* #__PURE__ */ defineComponent<Omit<UsePointerOptions, 'target'> & { target: 'window' | 'self' }>({
  name: 'UsePointer',
  props: [
    'pointerTypes',
    'initialValue',
    'target',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null)

    const data = reactive(usePointer({
      ...props,
      target: props.target === 'self' ? el : defaultWindow,
    }))

    return () => {
      if (slots.default)
        return slots.default(data, { ref: el })
    }
  },
})
