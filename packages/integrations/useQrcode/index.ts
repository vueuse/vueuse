import { ref, Ref, ComputedRef, watch } from 'vue-demi'
import QRCode from 'qrcode'

export function useQRCode(
  text: Ref<string> | ComputedRef<string> | string,
  options?: QRCode.QRCodeOptions,
) {
  const src = ref(text)
  const result = ref('')

  watch(src, async(value) => {
    result.value = await QRCode.toDataURL(value, options)
  }, {
    immediate: true,
  })

  return src
}
