import { defineComponent, h, ref } from 'vue-demi'
import type { RenderableComponent } from '../types'
import type { OnLongPressOptions } from '.'
import { onLongPress } from '.'

export interface OnLongPressProps extends RenderableComponent {
  options?: OnLongPressOptions
}

export const OnLongPress = /* #__PURE__ */ defineComponent<OnLongPressProps>({
  name: 'OnLongPress',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger', 'click'],
  setup(props, { slots, emit }) {
    const target = ref()
    const hasLongPressed = ref(false)

    const onClick = (e: Event) => {
      if (hasLongPressed.value) {
        hasLongPressed.value = false
        return
      }
      emit('click', e)
    }

    onLongPress(
      target,
      (e) => {
        hasLongPressed.value = true
        emit('trigger', e)
      },
      props.options,
    )
    return () => {
      if (slots.default) {
        return h(
          props.as || 'div',
          {
            ref: target,
            onClick,
          },
          slots.default(),
        )
      }
    }
  },
})
