import { ref } from 'vue-demi'

export interface EyeDropperOpenOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

export interface EyeDropperPrototype {
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

export interface EyeDropper {
  prototype: EyeDropperPrototype
  new(): EyeDropperPrototype
}

export interface UseEyeDropperOptions extends EyeDropperOpenOptions {
  /**
   * Initial sRGBHex.
   *
   * @default ''
   */
  initialValue?: string
}

type WindowEyeDropper = Window & typeof globalThis & {
  EyeDropper: EyeDropper
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 * @param initialValue string
 */
export function useEyeDropper(options: UseEyeDropperOptions = {}) {
  const { initialValue = '', signal } = options
  const isSupported = Boolean(typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = ref(initialValue)

  const eyeDropper = new (window as WindowEyeDropper).EyeDropper()
  async function open() {
    if (!isSupported)
      return
    const result = await eyeDropper.open({
      signal,
    })
    sRGBHex.value = result.sRGBHex
    return result
  }

  return { isSupported, sRGBHex, open }
}
