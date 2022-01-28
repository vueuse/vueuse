import { defineComponent, h, ref } from 'vue-demi'
import type { LongpressOptions } from '@vueuse/core'
import { onLongpress } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export interface OnLongpressProps extends RenderableComponent{
  options?: LongpressOptions
}

export const OnLongpress = defineComponent<OnLongpressProps>({
  name: 'OnLongpress',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onLongpress(target, (e) => {
      emit('trigger', e)
    }, props.options)

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
