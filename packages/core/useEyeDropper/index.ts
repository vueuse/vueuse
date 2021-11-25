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

export interface UseEyeDropperOptions {
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
  const { initialValue = '' } = options
  const isSupported = Boolean(typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = ref(initialValue)

  async function open(openOptions: EyeDropperOpenOptions = {}) {
    if (!isSupported)
      return
    const eyeDropper = new (window as WindowEyeDropper).EyeDropper()
    const result = await eyeDropper.open(openOptions)
    sRGBHex.value = result.sRGBHex
    return result
  }

  return { isSupported, sRGBHex, open }
}
