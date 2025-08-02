import type { OnLongPressOptions, RenderableComponent } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'
import { defineComponent, h, shallowRef } from 'vue'

export interface OnLongPressProps extends RenderableComponent {
  options?: OnLongPressOptions
}
// eslint-disable-next-line ts/consistent-type-definitions
export type OnLongPressEmits = {
  trigger: (event: PointerEvent) => void
}

export const OnLongPress = /* #__PURE__ */ defineComponent<
  OnLongPressProps,
  OnLongPressEmits
>(
  (props, { slots, emit }) => {
    const target = shallowRef<HTMLElement>()
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
  {
    name: 'OnLongPress',
    props: ['as', 'options'],
    emits: ['trigger'],
  },
)
