import { defineComponent, h, ref, watch } from 'vue-demi'
import type { RenderableComponent } from '../types'
import { useVisible } from '.'

export interface VisibleProps extends RenderableComponent {
  show: boolean
}

export const Visible = defineComponent<VisibleProps>({
  name: 'Visible',
  props: ['as', 'show'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()

    const { visible } = useVisible(
      target,
      props.show,
    )

    watch(() => props.show, () => {
      visible.value = props.show
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
