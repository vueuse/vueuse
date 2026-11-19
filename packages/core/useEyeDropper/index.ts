import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { Supportable } from '../types'
import { shallowReadonly, shallowRef } from 'vue'
import { useSupported } from '../useSupported'

export interface EyeDropperOpenOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

export interface EyeDropper {
  // eslint-disable-next-line ts/no-misused-new
  new(): EyeDropper
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

export interface UseEyeDropperState {
  /**
   * The last picked color, as a hex string
   *
   * @default ''
   */
  sRGBHex: string
}

export interface UseEyeDropperOptions {
  /**
   * Initial values for the returned state, used before a color is picked.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseEyeDropperState>

  /**
   * @deprecated Use `initials.sRGBHex` instead. Will be removed in v17.
   */
  initialValue?: string
}

export interface UseEyeDropperReturn extends Supportable, ReadonlyRefs<UseEyeDropperState> {
  open: (openOptions?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string } | undefined>
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useEyeDropper(options: UseEyeDropperOptions = {}): UseEyeDropperReturn {
  const {
    initialValue: deprecatedInitialValue,
    initials: {
      sRGBHex: initialSRGBHex = deprecatedInitialValue ?? '',
    } = {},
  } = options
  const isSupported = useSupported(() => typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = shallowRef(initialSRGBHex)

  async function open(openOptions?: EyeDropperOpenOptions) {
    if (!isSupported.value)
      return
    const eyeDropper: EyeDropper = new (window as any).EyeDropper()
    const result = await eyeDropper.open(openOptions)
    sRGBHex.value = result.sRGBHex
    return result
  }

  return {
    isSupported,
    sRGBHex: shallowReadonly(sRGBHex),
    open,
  }
}
