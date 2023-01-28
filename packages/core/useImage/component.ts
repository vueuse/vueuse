import { defineComponent, h, reactive } from 'vue-demi'
import { useImage } from '../useImage'
import type { UseImageOptions } from '../useImage'

import type { RenderableComponent } from '../types'

export const UseImage = /* #__PURE__ */ defineComponent<UseImageOptions & RenderableComponent>({
  name: 'UseImage',
  props: [
    'src',
    'srcset',
    'sizes',
    'as',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useImage(props))

    return () => {
      if (data.isLoading && slots.loading)
        return slots.loading(data)

      else if (data.error && slots.error)
        return slots.error(data.error)

      if (slots.default)
        return slots.default(data)

      return h(props.as || 'img', props)
    }
  },
})
