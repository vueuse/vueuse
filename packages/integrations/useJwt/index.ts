import type { ComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import jwt_decode from 'jwt-decode'
import type { JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode'

export interface JwtOptions<Fallback> {
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

export interface JwtResult<Payload, Header, Fallback> {
  header: ComputedRef<Header | Fallback>
  payload: ComputedRef<Payload | Fallback>
}

/**
 * Reactive decoded jwt token.
 *
 * @see https://vueuse.org/useJwt
 * @param jwt
 */
export function useJwt<
  Payload extends object = JwtPayload,
  Header extends object = JwtHeader,
  Fallback = null
>(
  encodedJwt: MaybeRef<string>,
  options: JwtOptions<Fallback> = {},
): JwtResult<Payload, Header, Fallback> {
  const encodedJwtRef = ref(encodedJwt)

  const {
    onError,
    fallbackValue = null,
  } = options

  const decodeWithFallback = <T extends object>(encodedJwt: string, options?: JwtDecodeOptions): T | Fallback => {
    try {
      return jwt_decode<T>(encodedJwt, options)
    }
    catch (err) {
      onError?.(err)
      return fallbackValue as Fallback
    }
  }

  const header = computed(() => decodeWithFallback<Header>(encodedJwtRef.value, { header: true }))

  const payload = computed(() => decodeWithFallback<Payload>(encodedJwtRef.value))

  return {
    header,
    payload,
  }
}
