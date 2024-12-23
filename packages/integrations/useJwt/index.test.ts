import type { JwtHeader, JwtPayload } from 'jwt-decode'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useJwt } from '.'

interface CustomJwtHeader extends JwtHeader {
  foo: string
}

interface CustomJwtPayload extends JwtPayload {
  foo: string
}

describe('useJwt', () => {
  const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')

  it('decoded jwt', () => {
    const { header, payload } = useJwt(encodedJwt)
    expect(header.value?.alg).toBe('HS256')
    expect(header.value?.typ).toBe('JWT')
    expect(payload.value?.sub).toBe('1234567890')
    expect(payload.value?.iat).toBe(1516239022)
  })

  it('decode jwt error', () => {
    const onErrorSpy = vi.fn()

    const { header, payload } = useJwt(ref('bad-token'), { onError: onErrorSpy })
    expect(header.value).toBe(null)
    expect(payload.value).toBe(null)
    expect(onErrorSpy).toHaveBeenCalled()
  })

  const encodedCustomJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImZvbyI6ImJhciJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJmb28iOiJiYXIifQ.S5QwvREUfgEdpB1ljG_xN6NI3HubQ79xx6J1J4dsJmg')

  it('decoded jwt with custom fields', () => {
    const { header, payload } = useJwt<CustomJwtPayload, CustomJwtHeader>(encodedCustomJwt)
    expect(header.value?.foo).toBe('bar')
    expect(payload.value?.foo).toBe('bar')
  })

  it('reactivity', () => {
    const jwt = ref(encodedJwt.value)
    const { header, payload } = useJwt<CustomJwtPayload, CustomJwtHeader>(jwt)
    expect(header.value?.foo).toBeUndefined()
    expect(payload.value?.foo).toBeUndefined()
    jwt.value = encodedCustomJwt.value
    expect(header.value?.foo).toBe('bar')
    expect(payload.value?.foo).toBe('bar')
  })
})
