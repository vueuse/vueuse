import type { RenderableComponent } from '../types'
import type { OnLongPressOptions } from './index'
import { ref as deepRef, defineComponent, h } from 'vue'
import { onLongPress } from './index'

export interface OnLongPressProps extends RenderableComponent {
  options?: OnLongPressOptions
}

export const OnLongPress = /* #__PURE__ */ defineComponent<OnLongPressProps>({
  name: 'OnLongPress',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = deepRef()
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
