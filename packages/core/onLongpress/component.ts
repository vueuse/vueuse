import { defineComponent, h, ref } from 'vue-demi'
import type { RenderableComponent } from '../types'
import type { LongpressOptions } from '.'
import { onLongpress } from '.'

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
