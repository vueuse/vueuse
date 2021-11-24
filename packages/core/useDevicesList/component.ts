import { defineComponent, reactive } from 'vue-demi'
import { useDevicesList, UseDevicesListOptions } from '@vueuse/core'

export const UseDevicesList = defineComponent<UseDevicesListOptions>({
  name: 'UseDevicesList',
  props: ['onUpdated', 'requestPermissions', 'constraints'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useDevicesList(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
