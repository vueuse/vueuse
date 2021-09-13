import { h, ref, defineComponent, reactive } from 'vue-demi'
import { useFullscreen } from '@vueuse/core'
import { RenderableComponent } from '../types'

export const UseFullscreen = defineComponent<RenderableComponent>({
  name: 'UseFullscreen',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useFullscreen(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
