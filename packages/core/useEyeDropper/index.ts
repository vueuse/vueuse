import { ref } from 'vue-demi'

export function useEyeDropper() {
  const isSupported = Boolean(window && 'EyeDropper' in window)
  const sRGBHex = ref('')

  async function eyeDropper() {
    // @ts-expect-error
    const eyeDropper = new window.EyeDropper()
    sRGBHex.value = (await eyeDropper.open()).sRGBHex
  }
  return { isSupported, sRGBHex, eyeDropper }
}
