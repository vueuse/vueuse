import type { ConfigurableWindow, ReducedMotionType } from '@vueuse/core'
import type { ComputedRef, Reactive, SlotsType } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePreferredReducedMotionProps extends ConfigurableWindow {}
interface UsePreferredReducedMotionSlots {
  default: (data: Reactive<{
    motion: ComputedRef<ReducedMotionType>
  }>) => any
}

export const UsePreferredReducedMotion = /* #__PURE__ */ defineComponent<
  UsePreferredReducedMotionProps,
  Record<string, never>,
  string,
  SlotsType<UsePreferredReducedMotionSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      motion: usePreferredReducedMotion(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePreferredReducedMotion',
    props: ['window'],
  },
)
