import { ref } from 'vue-demi'

export function useEyeDropper() {
  const isSupported = Boolean(window && 'EyeDropper' in window)
  const sRGBHex = ref('')

  async function open() {
    // @ts-expect-error
    const eyeDropper = new window.EyeDropper()
    const result = await eyeDropper.open()
    sRGBHex.value = result.sRGBHex
    return result
  }

  return { isSupported, sRGBHex, open }
}
