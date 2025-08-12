import type { RenderableComponent } from '@vueuse/core'
import type { UseFocusTrapOptions, UseFocusTrapReturn } from '@vueuse/integrations/useFocusTrap'
import type { Reactive, SlotsType } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseFocusTrapProps extends RenderableComponent {
  options?: UseFocusTrapOptions
}
/**
 * @deprecated
 */
export interface ComponentUseFocusTrapOptions extends UseFocusTrapProps {}

interface UseFocusTrapSlots {
  default: (data: Reactive<UseFocusTrapReturn>) => any
}

export const UseFocusTrap = /* #__PURE__ */ defineComponent<
  UseFocusTrapProps,
  Record<string, never>,
  string,
  SlotsType<UseFocusTrapSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLElement>()
    const data = reactive(useFocusTrap(target, props.options))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseFocusTrap',
    props: ['as', 'options'],
  },
)
