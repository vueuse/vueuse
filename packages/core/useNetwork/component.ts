import { defineComponent } from 'vue-demi'
import { useNetwork } from '.'

export const UseNetwork = defineComponent({
  name: 'UseNetwork',
  setup(props, { slots }) {
    const {
      isOnline,
      isSupported,
      downlink,
      downlinkMax,
      effectiveType,
      offlineAt,
      saveData,
      type,
    } = useNetwork()

    return () => {
      if (slots.default) {
        return slots.default({
          isSupported,
          isOnline: isOnline.value,
          downlink: downlink.value,
          downlinkMax: downlinkMax.value,
          effectiveType: effectiveType.value,
          offlineAt: offlineAt.value,
          saveData: saveData.value,
          type: type.value,
        })
      }
    }
  },
})
