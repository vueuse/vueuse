import { ref, Ref, ComputedRef, watch, isRef } from 'vue-demi'
import QRCode from 'qrcode'

export function useQrcode(text: Ref<string> | ComputedRef<string> | string) {
  const src = ref('')

  watch(isRef(text) ? text : () => text, async(value) => {
    if (value) {
      src.value = await await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'H',
      })
    }
  }, {
    immediate: true,
  })

  return src
}
