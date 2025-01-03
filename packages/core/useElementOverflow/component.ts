import { type RenderableComponent, useElementOverflow, type UseElementOverflowOptions } from '@vueuse/core'
import { defineComponent, h, reactive, ref } from 'vue'

export const UseElementOverflow = /* #__PURE__ */ defineComponent<UseElementOverflowOptions & RenderableComponent>({
  name: 'UseElementOverflow',
  props: ['observeMutation', 'as'] as unknown as undefined,
  emits: ['update'],
  setup(props, { slots, attrs, emit }) {
    const target = ref()
    const info = reactive(useElementOverflow(target, {
      observeMutation: props.observeMutation,
      onUpdated: (...args: any[]) => { emit('update', ...args) },
    }))
    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target, ...attrs }, slots.default(info))
    }
  },
})
