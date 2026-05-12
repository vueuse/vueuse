import type { UseDarkOptions, UseDarkReturn } from '@vueuse/core'
import type { ToggleFn } from '@vueuse/shared'
import type { Reactive, SlotsType } from 'vue'
import { useDark } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'
import { defineComponent, reactive } from 'vue'

export interface UseDarkProps extends UseDarkOptions {}
interface UseDarkSlots {
  default: (data: Reactive<{
    isDark: UseDarkReturn
    toggleDark: ToggleFn
  }>) => any
}

export const UseDark = /* #__PURE__ */ defineComponent<
  UseDarkProps,
  Record<string, never>,
  string,
  SlotsType<UseDarkSlots>
>(
  (props, { slots }) => {
    const isDark = useDark(props)
    const data = reactive({
      isDark,
      toggleDark: useToggle(isDark),
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseDark',
    props: [
      'attribute',
      'deep',
      'disableTransition',
      'emitAuto',
      'eventFilter',
      'flush',
      'initOnMounted',
      'initialValue',
      'listenToStorageChanges',
      'mergeDefaults',
      'onChanged',
      'onError',
      'selector',
      'serializer',
      'shallow',
      'storage',
      'storageKey',
      'storageRef',
      'valueDark',
      'valueLight',
      'window',
      'writeDefaults',
    ],
  },
)
