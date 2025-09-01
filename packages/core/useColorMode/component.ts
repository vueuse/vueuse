import type { BasicColorMode, UseColorModeOptions, UseColorModeReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useColorMode } from '@vueuse/core'
import { defineComponent, reactive } from 'vue'

export interface UseColorModeProps extends UseColorModeOptions {}
interface UseColorModeSlots {
  default: (data: Reactive<{
    mode: UseColorModeReturn<BasicColorMode>
    system: UseColorModeReturn['system']
    store: UseColorModeReturn['store']
  }>) => any
}

export const UseColorMode = /* #__PURE__ */ defineComponent<
  UseColorModeProps,
  Record<string, never>,
  string,
  SlotsType<UseColorModeSlots>
>(
  (props, { slots }) => {
    const mode = useColorMode(props)
    const data = reactive({
      mode,
      system: mode.system,
      store: mode.store,
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseColorMode',
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
      'modes',
      'onChanged',
      'onError',
      'selector',
      'serializer',
      'shallow',
      'storage',
      'storageKey',
      'storageRef',
      'window',
      'writeDefaults',
    ],
  },
)
