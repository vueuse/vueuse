import { MaybeRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import QRCode from 'qrcode'

export function useQRCode(
  text: MaybeRef<string>,
  options?: QRCode.QRCodeToDataURLOptions,
) {
  const src = ref(text)
  const result = ref('')

  watch(
    src,
    async(value) => {
      result.value = await QRCode.toDataURL(value, options)
    },
    { immediate: true },
  )

  return result
}
