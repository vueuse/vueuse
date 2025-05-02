import type { JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { computed, toValue } from 'vue'

export interface UseJwtOptions<Fallback> {
  /**
   * Value returned when encounter error on decoding
   *
   * @default null
   */
  fallbackValue?: Fallback

  /**
   * Error callback for decoding
   */
  onError?: (error: unknown) => void
}

export interface UseJwtReturn<Payload, Header, Fallback> {
  header: ComputedRef<Header | Fallback>
  payload: ComputedRef<Payload | Fallback>
}

/**
 * Reactive decoded jwt token.
 *
 * @see https://vueuse.org/useJwt
 */
export function useJwt<
  Payload extends object = JwtPayload,
  Header extends object = JwtHeader,
  Fallback = null,
>(
  encodedJwt: MaybeRefOrGetter<string>,
  options: UseJwtOptions<Fallback> = {},
): UseJwtReturn<Payload, Header, Fallback> {
  const {
    onError,
    fallbackValue = null,
  } = options

  const decodeWithFallback = <T extends object>(encodedJwt: string, options?: JwtDecodeOptions): T | Fallback => {
    try {
      return jwtDecode<T>(encodedJwt, options)
    }
    catch (err) {
      onError?.(err)
      return fallbackValue as Fallback
    }
  }

  const header = computed(() => decodeWithFallback<Header>(toValue(encodedJwt), { header: true }))
  const payload = computed(() => decodeWithFallback<Payload>(toValue(encodedJwt)))

  return {
    header,
    payload,
  }
}
