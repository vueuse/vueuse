import type { JwtHeader, JwtPayload } from 'jwt-decode'
import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useJwt } from '.'

interface CustomJwtHeader extends JwtHeader {
  foo: string
}

interface CustomJwtPayload extends JwtPayload {
  foo: string
}

describe('useJwt', () => {
  const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')

  test('decoded jwt', () => {
    useSetup(() => {
      const { header, payload } = useJwt(encodedJwt)
      expect(header.value?.alg).toBe('HS256')
      // NOTE: ts-ignore can be removed as soon as jwt-decode > v3.1.2 was released
      // see: https://github.com/auth0/jwt-decode/pull/115
      // @ts-ignore
      expect(header.value?.typ).toBe('JWT')
      expect(payload.value?.sub).toBe('1234567890')
      expect(payload.value?.iat).toBe(1516239022)
    })
  })

  test('decode jwt error', () => {
    useSetup(() => {
      const mockCallback = jest.fn()
      const { header, payload } = useJwt(ref('bad-token'), { onError: mockCallback })
      expect(header.value).toBe(null)
      expect(payload.value).toBe(null)

      expect(mockCallback.mock.calls.length).toBeGreaterThan(0)
    })
  })

  const encodedCustomJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImZvbyI6ImJhciJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJmb28iOiJiYXIifQ.S5QwvREUfgEdpB1ljG_xN6NI3HubQ79xx6J1J4dsJmg')

  test('decoded jwt with custom fields', () => {
    useSetup(() => {
      const { header, payload } = useJwt<CustomJwtPayload, CustomJwtHeader>(encodedCustomJwt)
      expect(header.value?.foo).toBe('bar')
      expect(payload.value?.foo).toBe('bar')
    })
  })

  test('reactivity', () => {
    useSetup(() => {
      const jwt = ref(encodedJwt.value)
      const { header, payload } = useJwt<CustomJwtPayload, CustomJwtHeader>(jwt)
      expect(header.value?.foo).toBeUndefined()
      expect(payload.value?.foo).toBeUndefined()
      jwt.value = encodedCustomJwt.value
      expect(header.value?.foo).toBe('bar')
      expect(payload.value?.foo).toBe('bar')
    })
  })
})
