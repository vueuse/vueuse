import { describe, expect, it } from 'vitest'
import { useRouteParams } from '.'

describe('useRouteQuery', () => {
  const getRoute = (params: Record<string, any> = {}) => ({
    query: {},
    fullPath: '',
    hash: '',
    matched: [],
    meta: {},
    name: '',
    params: { id: '1', ...params },
    path: '',
    redirectedFrom: undefined,
  })

  it('should return transformed value', () => {
    const router = {} as any
    const route = getRoute()

    const id = useRouteParams('id', '1', { transform: Number, route, router })

    expect(id.value).toBe(1)
  })
})
