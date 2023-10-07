import { defineComponent, reactive } from 'vue-demi'
import type { UseDarkOptions } from '@vueuse/core'
import { useDark } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'

export const UseDark = /* #__PURE__ */ defineComponent<UseDarkOptions>({
  name: 'UseDark',
  props: ['selector', 'attribute', 'valueDark', 'valueLight', 'onChanged', 'storageKey', 'storage'] as unknown as undefined,
  setup(props, { slots }) {
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
})
