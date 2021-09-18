import { h, ref, defineComponent } from 'vue-demi'
import { onClickOutside, OnClickOutsideOptions } from '@vueuse/core'
import { RenderableComponent } from '../types'

export const OnClickOutside = defineComponent<OnClickOutsideOptions & RenderableComponent>({
  name: 'OnClickOutside',
  props: ['as', 'event'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    }, { event: props.event })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
