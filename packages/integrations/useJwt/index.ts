import { MaybeRef } from './../../shared/utils/types'
import jwt_decode, { InvalidTokenError, JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode'
import { computed, ref, Ref } from 'vue-demi'

/**
 * Reactive decoded jwt token.
 *
 * @see {@link https://vueuse.js.org/integrations/useJwt/}
 * @param jwt
 */
export function useJwt<Payload extends object = JwtPayload, Header extends object = JwtHeader>(encodedJwt: MaybeRef<string>, onError?: (error: InvalidTokenError) => void) {
  const encodedJwtRef = ref(encodedJwt)

  const decodeWithFallback = <T extends object>(encodedJwt: string, options?: JwtDecodeOptions) => {
    try {
      return jwt_decode<T>(encodedJwt, options)
    }
    catch (err) {
      if (onError) onError(err)
      return {} as T
    }
  }

  const header = computed(() => decodeWithFallback<Header>(encodedJwtRef.value, { header: true }))

  const payload = computed(() => decodeWithFallback<Payload>(encodedJwtRef.value))

  return {
    header,
    payload,
  }
}
