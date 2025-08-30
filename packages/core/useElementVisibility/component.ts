import type { RenderableComponent, UseElementVisibilityOptions, UseElementVisibilityReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseElementVisibilityProps extends UseElementVisibilityOptions, RenderableComponent {}
interface UseElementVisibilitySlots {
  default: (data: Reactive<{
    isVisible: UseElementVisibilityReturn
  }>) => any
}

export const UseElementVisibility = /* #__PURE__ */ defineComponent<
  UseElementVisibilityProps,
  Record<string, never>,
  string,
  SlotsType<UseElementVisibilitySlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive({
      isVisible: useElementVisibility(target, props),
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseElementVisibility',
    props: [
      'as',
      'once',
      'rootMargin',
      'scrollTarget',
      'threshold',
      'window',
    ],
  },
)
