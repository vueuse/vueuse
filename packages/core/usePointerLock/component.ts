import type { RenderableComponent, UsePointerLockOptions, UsePointerLockReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { usePointerLock } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export interface UsePointerLockProps extends RenderableComponent, UsePointerLockOptions {}
interface UsePointerLockSlots {
  default: (data: Reactive<UsePointerLockReturn>) => any
}

export const UsePointerLock = /* #__PURE__ */ defineComponent<
  UsePointerLockProps,
  Record<string, never>,
  string,
  SlotsType<UsePointerLockSlots>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(usePointerLock(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
  {
    name: 'UsePointerLock',
    props: [
      'as',
      'document',
    ],
  },
)
