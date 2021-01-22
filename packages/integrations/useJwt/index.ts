import jwt_decode, { JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode'
import { computed, Ref } from 'vue-demi'

/**
 * Reactive decoced jwt token.
 *
 * @see {@link https://vueuse.js.org/integrations/useJwt/}
 * @param jwt
 */
export function useJwt<Payload extends object = JwtPayload, Header extends object = JwtHeader>(encodedJwt: Ref<string>) {
  const decodeWithFallback = <T extends object>(encodedJwt: string, options?: JwtDecodeOptions) => {
    try {
      return jwt_decode<T>(encodedJwt, options)
    }
    catch (err) {
      return Object.assign({})
    }
  }

  const header = computed((): Header => decodeWithFallback<Header>(encodedJwt.value, { header: true }))

  const payload = computed((): Payload => decodeWithFallback<Payload>(encodedJwt.value))

  return {
    header,
    payload,
  }
}
