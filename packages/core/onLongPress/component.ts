import type { OnLongPressOptions, RenderableComponent, UseOnLongPressReturn } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { onLongPress } from '@vueuse/core'
import { defineComponent, h, shallowRef } from 'vue'

export interface OnLongPressProps extends RenderableComponent {
  options?: OnLongPressOptions
}
// eslint-disable-next-line ts/consistent-type-definitions
export type OnLongPressEmits = {
  trigger: (event: PointerEvent) => void
}

interface OnLongPressSlots {
  default: (data: UseOnLongPressReturn) => any
}

export const OnLongPress = /* #__PURE__ */ defineComponent<
  OnLongPressProps,
  OnLongPressEmits,
  string,
  SlotsType<OnLongPressSlots>
>(
  (props, { slots, emit }) => {
    const target = shallowRef<HTMLElement>()
    const data = onLongPress(
      target,
      (e) => {
        emit('trigger', e)
      },
      props.options,
    )

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'OnLongPress',
    props: ['as', 'options'],
    emits: ['trigger'],
  },
)
