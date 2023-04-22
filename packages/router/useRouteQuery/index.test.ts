import { nextTick } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import type { Ref } from 'vue-demi'
import { useRouteQuery } from '.'

describe('useRouteQuery', () => {
  const getRoute = (query: Record<string, any> = {}) => ({
    query,
    fullPath: '',
    hash: '',
    matched: [],
    meta: {},
    name: '',
    params: {},
    path: '',
    redirectedFrom: undefined,
  })

  it('should export', () => {
    expect(useRouteQuery).toBeDefined()
  })

  it('should return transformed value', () => {
    const router = {} as any
    const route = getRoute({
      search: 'vue3',
      page: '1',
    })
    const transform = Number
    const toArray = (param: string | string[] | null) => Array.isArray(param) ? param : [param]

    const page = useRouteQuery('page', '1', { transform, route, router })
    const perPage = useRouteQuery('perPage', '15', { transform, route, router })
    const tags = useRouteQuery('tags', [], { transform: toArray, route: getRoute({ tags: 'vite' }), router })

    expect(page.value).toBe(1)
    expect(perPage.value).toBe(15)
    expect(tags.value).toEqual(['vite'])
  })

  it('should re-evaluate the value immediately', () => {
    let route = getRoute({
      search: 'vue3',
    })
    const router = { replace: (r: any) => route = r } as any

    const code: Ref<any> = useRouteQuery('code', 'foo', { route, router })
    const search: Ref<any> = useRouteQuery('search', null, { route, router })

    code.value = 'bar'

    expect(code.value).toBe('bar')
    expect(search.value).toBe('vue3')
  })

  it('should update the route', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const code: Ref<any> = useRouteQuery('code', null, { route, router })
    const page: Ref<any> = useRouteQuery('page', null, { route, router })
    const lang: Ref<any> = useRouteQuery('lang', null, { route, router })

    code.value = 'bar'
    page.value = '1'
    lang.value = 'en'

    await nextTick()

    expect(code.value).toBe('bar')
    expect(route.query.code).toBe('bar')
    expect(page.value).toBe('1')
    expect(route.query.page).toBe('1')
    expect(lang.value).toBe('en')
    expect(route.query.lang).toBe('en')
  })

  it('should return default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const page: Ref<any> = useRouteQuery('page', 2, { route, router })
    const lang: Ref<any> = useRouteQuery('lang', 'pt-BR', { route, router })

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
  })
})
