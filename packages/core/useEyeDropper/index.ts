import { ref } from 'vue-demi'

type WindowEyeDropper = Window & typeof globalThis & {
  EyeDropper: {
    new(): {
      open: () => Promise<{ sRGBHex: string }>
      [Symbol.toStringTag]: 'EyeDropper'
    }
  }
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 * @param initialValue string
 */
export function useEyeDropper(initialValue = '') {
  const isSupported = Boolean(typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = ref(initialValue)

  async function open() {
    if (!isSupported)
      return
    const eyeDropper = new (window as WindowEyeDropper).EyeDropper()
    const result = await eyeDropper.open()
    sRGBHex.value = result.sRGBHex
    return result
  }

  return { isSupported, sRGBHex, open }
}
