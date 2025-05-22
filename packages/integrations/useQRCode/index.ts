import type { MaybeRefOrGetter } from 'vue'
import { isClient, toRef } from '@vueuse/shared'
import QRCode from 'qrcode'
import { shallowRef, watch } from 'vue'

/**
 * Wrapper for qrcode.
 *
 * @see https://vueuse.org/useQRCode
 * @param text
 * @param options
 */
export function useQRCode(
  text: MaybeRefOrGetter<string>,
  options?: QRCode.QRCodeToDataURLOptions,
) {
  const src = toRef(text)
  const result = shallowRef('')

  watch(
    src,
    async (value) => {
      if (src.value && isClient)
        result.value = await QRCode.toDataURL(value, options)
    },
    { immediate: true },
  )

  return result
}
