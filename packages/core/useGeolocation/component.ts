import { defineComponent, reactive } from 'vue-demi'
import type { UseGeolocationOptions } from '@vueuse/core'
import { useGeolocation } from '@vueuse/core'

export const UseGeolocation = /* #__PURE__ */ defineComponent<UseGeolocationOptions>({
  name: 'UseGeolocation',
  props: ['enableHighAccuracy', 'maximumAge', 'timeout', 'navigator'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useGeolocation(props))
    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
