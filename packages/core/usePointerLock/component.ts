import type { RenderableComponent } from '../types'
import { usePointerLock } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export const UsePointerLock = defineComponent<RenderableComponent>({
  name: 'UsePointerLock',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(usePointerLock(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
