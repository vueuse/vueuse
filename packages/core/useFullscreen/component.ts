import type { RenderableComponent, UseFullscreenOptions, UseFullscreenReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseFullscreenProps extends UseFullscreenOptions, RenderableComponent {}
interface UseFullscreenSlots {
  default: (data: Reactive<UseFullscreenReturn>) => any
}

export const UseFullscreen = /* #__PURE__ */ defineComponent<
  UseFullscreenProps,
  Record<string, never>,
  string,
  SlotsType<UseFullscreenSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(useFullscreen(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseFullscreen',
    props: [
      'as',
      'autoExit',
      'document',
    ],
  },
)
