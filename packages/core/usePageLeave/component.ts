import type { ConfigurableWindow, UsePageLeaveReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { usePageLeave } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UsePageLeaveProps extends ConfigurableWindow {}
interface UsePageLeaveSlots {
  default: (data: Reactive<{
    isLeft: UsePageLeaveReturn
  }>) => any
}

export const UsePageLeave = /* #__PURE__ */ defineComponent<
  UsePageLeaveProps,
  Record<string, never>,
  string,
  SlotsType<UsePageLeaveSlots>
>(
  (props, { slots }) => {
    const data = reactive({
      isLeft: usePageLeave(props),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UsePageLeave',
    props: ['window'],
  },
)
