import type { RenderableComponent } from '../types'
import type { OnClickOutsideOptions } from './index'
import { onClickOutside } from '@vueuse/core'
import { defineComponent, h, shallowRef } from 'vue'

export interface OnClickOutsideProps extends RenderableComponent {
  options?: Omit<OnClickOutsideOptions, 'controls'>
}

export const OnClickOutside = /* #__PURE__ */ defineComponent<OnClickOutsideProps>({
  name: 'OnClickOutside',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = shallowRef<HTMLDivElement>()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    }, props.options)

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
