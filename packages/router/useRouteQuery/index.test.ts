import { describe, expect, it } from 'vitest'
import { useRouteQuery } from '.'

describe('useRouteQuery', () => {
  const getRoute = (query: Record<string, any> = {}) => ({
    query: {
      search: 'vue3',
      page: '1',
      ...query,
    },
    fullPath: '',
    hash: '',
    matched: [],
    meta: {},
    name: '',
    params: {},
    path: '',
    redirectedFrom: undefined,
  })

  it('should return transformed value', () => {
    const router = {} as any
    const route = getRoute()
    const transform = Number
    const toArray = (param: string | string[] | null) => Array.isArray(param) ? param : [param]

    const page = useRouteQuery('page', '1', { transform, route, router })
    const perPage = useRouteQuery('perPage', '15', { transform, route, router })
    const tags = useRouteQuery('tags', [], { transform: toArray, route: getRoute({ tags: 'vite' }), router })

    expect(page.value).toBe(1)
    expect(perPage.value).toBe(15)
    expect(tags.value).toEqual(['vite'])
  })
})
