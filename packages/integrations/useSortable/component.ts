import type { RenderableComponent } from '@vueuse/core'
import type { UseSortableOptions, UseSortableReturn } from '@vueuse/integrations/useSortable'
import type { Reactive, SlotsType } from 'vue'
import { useVModel } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UseSortableProps extends RenderableComponent {
  modelValue: any[]
  options?: UseSortableOptions
}
interface UseSortableSlots {
  default: (data: Reactive<UseSortableReturn>) => any
}

export const UseSortable = /* #__PURE__ */ defineComponent<
  UseSortableProps,
  Record<string, never>,
  string,
  SlotsType<UseSortableSlots>
>(
  (props, { slots }) => {
    const list = useVModel(props, 'modelValue')
    const target = shallowRef<HTMLElement>()
    const data = reactive(useSortable(target, list, props.options))
    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UseSortable',
    props: [
      'as',
      'modelValue',
      'options',
    ],
  },
)
