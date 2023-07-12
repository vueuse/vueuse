import { effectScope, nextTick, reactive, ref, watch } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import type { Ref } from 'vue-demi'
import { useRouteQuery } from '.'

describe('useRouteQuery', () => {
  const getRoute = (query: Record<string, any> = {}) => reactive({
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

    expect(code.value).toBe('foo')

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

  it('should reset state on scope dispose', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const scopeA = effectScope()
    const scopeB = effectScope()

    let page: Ref<any> = ref(null)
    let lang: Ref<any> = ref(null)
    let code: Ref<any> = ref(null)
    let search: Ref<any> = ref(null)

    await scopeA.run(async () => {
      page = useRouteQuery('page', null, { route, router })
      lang = useRouteQuery('lang', null, { route, router })

      page.value = 2
      lang.value = 'pt-BR'

      await nextTick()
    })

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
    expect(route.query.page).toBe(2)
    expect(route.query.lang).toBe('pt-BR')

    await scopeB.run(async () => {
      code = useRouteQuery('code', null, { route, router })
      search = useRouteQuery('search', null, { route, router })

      code.value = 'xyz'
      search.value = 'vueuse'

      await nextTick()
    })

    expect(code.value).toBe('xyz')
    expect(search.value).toBe('vueuse')
    expect(route.query.code).toBe('xyz')
    expect(route.query.search).toBe('vueuse')

    scopeB.stop()

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
    expect(code.value).toBeNull()
    expect(search.value).toBeNull()

    scopeA.stop()

    expect(page.value).toBeNull()
    expect(lang.value).toBeNull()
  })

  it('should change the value when the route changes', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const page: Ref<any> = useRouteQuery('page', null, { route, router })

    expect(page.value).toBeNull()

    route.query = { page: '2' }

    expect(page.value).toBe('2')
  })

  it ('should differentiate null and undefined', () => {
    let route = getRoute({
      page: 1,
    })
    const router = { replace: (r: any) => route = r } as any

    const lang: Ref<any> = useRouteQuery('lang', undefined, { route, router })

    expect(lang.value).toBeUndefined()

    route.query = { ...route.query, lang: null }

    expect(lang.value).toBeNull()

    const code: Ref<any> = useRouteQuery('code', null, { route, router })

    expect(code.value).toBeNull()

    const page: Ref<any> = useRouteQuery('page', null, { route, router })

    expect(page.value).toBe(1)
  })

  it('should avoid trigger effects when the value doesn\'t change', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const onUpdate = vi.fn()

    const page = useRouteQuery('page', 1, { transform: Number, route, router })

    watch(page, onUpdate)

    page.value = 1

    await nextTick()

    expect(page.value).toBe(1)
    expect(route.query.page).toBe(1)
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should keep current query and hash', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    route.params = { foo: 'bar' }
    route.hash = '#hash'

    const id: Ref<any> = useRouteQuery('id', null, { route, router })

    id.value = '2'

    await nextTick()

    expect(id.value).toBe('2')
    expect(route.hash).toBe('#hash')
    expect(route.params).toEqual({ foo: 'bar' })
  })

  it('should allow ref or getter as default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const defaultPage = ref(1)
    const defaultLang = () => 'pt-BR'

    const page: Ref<any> = useRouteQuery('page', defaultPage, { route, router })
    const lang: Ref<any> = useRouteQuery('lang', defaultLang, { route, router })

    expect(page.value).toBe(1)
    expect(lang.value).toBe('pt-BR')

    page.value = 2
    lang.value = 'en-US'

    expect(page.value).toBe(2)
    expect(lang.value).toBe('en-US')
  })
})
