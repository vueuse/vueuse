import type { OnClickOutsideOptions } from '.'
import type { RenderableComponent } from '../types'
import { onClickOutside } from '@vueuse/core'
import { defineComponent, h, ref } from 'vue'

export interface OnClickOutsideProps extends RenderableComponent {
  options?: OnClickOutsideOptions
}

export const OnClickOutside = /* #__PURE__ */ defineComponent<OnClickOutsideProps>({
  name: 'OnClickOutside',
  props: ['as', 'options'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    }, props.options)

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
