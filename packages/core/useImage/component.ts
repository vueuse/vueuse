import type { UseImageOptions, UseImageReturn } from '@vueuse/core'
import type { Reactive, SlotsType, UnwrapRef } from 'vue'
import type { RenderableComponent } from '../types'
import { useImage } from '@vueuse/core'
import { defineComponent, h, reactive } from 'vue'

export interface UseImageProps extends UseImageOptions, RenderableComponent {}
interface UseImageSlots {
  default: (data: Reactive<UseImageReturn>) => any
  loading: (data: Reactive<UseImageReturn>) => any
  error: (data: UnwrapRef<UseImageReturn['error']>) => any
}

export const UseImage = /* #__PURE__ */ defineComponent<
  UseImageProps,
  Record<string, never>,
  string,
  SlotsType<UseImageSlots>
>(
  (props, { slots }) => {
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
  {
    name: 'UseImage',
    props: [
      'alt',
      'as',
      'class',
      'crossorigin',
      'decoding',
      'fetchPriority',
      'height',
      'ismap',
      'loading',
      'referrerPolicy',
      'sizes',
      'src',
      'srcset',
      'usemap',
      'width',
    ],
  },
)
