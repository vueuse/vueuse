import type { RenderableComponent } from '../types'
import { usePointerLock } from '@vueuse/core'
import { ref as deepRef, defineComponent, h, reactive } from 'vue'

export const UsePointerLock = defineComponent<RenderableComponent>({
  name: 'UsePointerLock',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = deepRef()
    const data = reactive(usePointerLock(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
