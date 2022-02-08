import { defineComponent, h, ref } from 'vue-demi'
import type { RenderableComponent } from '../types'
import type { LongPressOptions } from '.'
import { onLongPress } from '.'

export interface onLongPressProps extends RenderableComponent {
  options?: LongPressOptions
}

export const OnLongPress = defineComponent<onLongPressProps>({
  name: 'OnLongPress',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onLongPress(
      target,
      (e) => {
        emit('trigger', e)
      },
      props.options,
    )

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
