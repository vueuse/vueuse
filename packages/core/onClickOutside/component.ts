import type { OnClickOutsideOptions, RenderableComponent } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { defineComponent, h, shallowRef } from 'vue'

export interface OnClickOutsideProps extends RenderableComponent {
  options?: Omit<OnClickOutsideOptions, 'controls'>
}
// eslint-disable-next-line ts/consistent-type-definitions
export type OnClickOutsideEmits = {
  trigger: (event: Event) => void
}

export const OnClickOutside = /* #__PURE__ */ defineComponent<
  OnClickOutsideProps,
  OnClickOutsideEmits
>(
  (props, { slots, emit }) => {
    const target = shallowRef<HTMLDivElement>()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    }, props.options)

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
  {
    name: 'OnClickOutside',
    props: ['as', 'options'],
    emits: ['trigger'],
  },
)
