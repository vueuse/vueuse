import { defineComponent, reactive } from 'vue-demi'
import type { UseColorModeOptions } from '.'
import { useColorMode } from '.'

export const UseColorMode = /* #__PURE__ */ defineComponent<UseColorModeOptions>({
  name: 'UseColorMode',
  props: ['selector', 'attribute', 'modes', 'onChanged', 'storageKey', 'storage', 'emitAuto'] as unknown as undefined,
  setup(props, { slots }) {
    const mode = useColorMode(props)
    const data = reactive({
      mode,
    })

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
