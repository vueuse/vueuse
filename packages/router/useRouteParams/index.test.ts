import type { Ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useRouteParams } from '.'

describe('useRouteQuery', () => {
  const getRoute = (params: Record<string, any> = {}) => ({
    params,
    query: {},
    fullPath: '',
    hash: '',
    matched: [],
    meta: {},
    name: '',
    path: '',
    redirectedFrom: undefined,
  })

  it('should return current value', () => {
    const router = {} as any
    const route = getRoute({
      id: '1',
    })

    const id = useRouteParams('id', null, { route, router })

    expect(id.value).toBe('1')
  })

  it('should return transformed value', () => {
    const router = {} as any
    const route = getRoute()

    const id = useRouteParams('id', '1', { transform: Number, route, router })

    expect(id.value).toBe(1)
  })

  it('should re-evaluate the value immediately', () => {
    const router = { replace: () => {} } as any
    const route = getRoute()

    const slug: Ref<any> = useRouteParams('slug', 'foo', { route, router })

    slug.value = 'bar'

    expect(slug.value).toBe('bar')
  })
})
