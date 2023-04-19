import { describe, expect, it } from 'vitest'
import { useRouteHash } from '.'

describe('useRouteHash', () => {
  const getRoute = (hash = '') => ({
    query: {},
    fullPath: '',
    hash,
    matched: [],
    meta: {},
    name: '',
    params: {},
    path: '',
    redirectedFrom: undefined,
  })

  it('should return current value', () => {
    const router = {} as any
    const route = getRoute('header')

    const hash = useRouteHash(null, { route, router })

    expect(hash.value).toBe(route.hash)
  })

  it('should re-evaluate the value immediately', () => {
    const router = { replace: () => {} } as any
    const route = getRoute('header')

    const hash = useRouteHash(null, { route, router })

    hash.value = 'footer'

    expect(hash.value).toBe('footer')
  })
})
