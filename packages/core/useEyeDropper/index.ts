import { ref } from 'vue-demi'
import { useSupported } from '../useSupported'

export interface EyeDropperOpenOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

export interface EyeDropper {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new(): EyeDropper
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

export interface UseEyeDropperOptions {
  /**
   * Initial sRGBHex.
   *
   * @default ''
   */
  initialValue?: string

  /**
   * Throw error if not supported.
   *
   * @default false
   */
  throwError?: boolean
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 * @param initialValue string
 */
export function useEyeDropper(options: UseEyeDropperOptions = {}) {
  const {
    initialValue = '',
    throwError = false,
  } = options
  const isSupported = useSupported(() => typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = ref(initialValue)

  async function open(openOptions?: EyeDropperOpenOptions) {
    if (!isSupported.value)
      return
    const eyeDropper: EyeDropper = new (window as any).EyeDropper()
    try {
      const result = await eyeDropper.open(openOptions)
      sRGBHex.value = result.sRGBHex
      return result
    }
    catch (e) {
      if (throwError)
        throw e
    }
  }

  return {
    isSupported,
    sRGBHex,
    open,
  }
}

export type UseEyeDropperReturn = ReturnType<typeof useEyeDropper>
