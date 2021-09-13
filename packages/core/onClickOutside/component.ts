import { h, ref, defineComponent } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import { RenderableComponent } from '../types'

export const OnClickOutside = defineComponent<RenderableComponent>({
  name: 'OnClickOutside',
  props: ['as'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
