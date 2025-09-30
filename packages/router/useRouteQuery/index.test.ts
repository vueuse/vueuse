import type { Maybe } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { Merge } from '../_types'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { computed, ref as deepRef, effectScope, nextTick, reactive, shallowRef, toValue, watch } from 'vue'
import { useRouteQuery } from './index'

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

    expectTypeOf(page.value).toEqualTypeOf<number>()
    expectTypeOf(perPage.value).toEqualTypeOf<number>()
    expectTypeOf(tags.value).toEqualTypeOf<Array<string | null>>()

    expect(page.value).toBe(1)
    expect(perPage.value).toBe(15)
    expect(tags.value).toEqual(['vite'])
  })

  it('should handle transform get/set', async () => {
    let route = getRoute({
      serialized: '{"foo":"bar"}',
    })
    interface ObjectType { foo?: string }
    const router = { replace: (r: any) => route = r } as any

    const object = useRouteQuery('serialized', undefined, {
      transform: {
        get: value => JSON.parse(
          value
            ? typeof value === 'object'
              ? JSON.stringify(value)
              : value
            : '{}',
        ) as ObjectType,
        set: value => JSON.stringify(value),
      },
      router,
      route,
    })

    expectTypeOf(object.value).toEqualTypeOf<ObjectType>()

    expect(object.value).toEqual({ foo: 'bar' })

    object.value = { foo: 'baz' }

    await nextTick()

    expect(route.query.serialized).toBe('{"foo":"baz"}')
    expect(object.value).toEqual({ foo: 'baz' })
  })

  it('should handle transform with only get', async () => {
    let route = getRoute({
      search: 'VUE3',
    })
    const router = { replace: (r: any) => route = r } as any

    const search = useRouteQuery('search', undefined, {
      transform: {
        get: (value: string) => value.toLowerCase(),
      },
      router,
      route,
    })

    expectTypeOf(search.value).toEqualTypeOf<string>()

    expect(search.value).toBe('vue3')
    expect(route.query.search).toBe('VUE3')
  })

  it('should handle transform with only set', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const search = useRouteQuery('search', undefined, {
      transform: {
        set: (value: string) => value.toLowerCase(),
      },
      router,
      route,
    })

    expectTypeOf(search.value).toEqualTypeOf<string>()

    search.value = 'VUE3'
    expect(search.value).toBe('vue3')

    await nextTick()

    expect(route.query.search).toBe('vue3')
  })

  it('should re-evaluate the value immediately', () => {
    let route = getRoute({
      search: 'vue3',
    })
    const router = { replace: (r: any) => route = r } as any

    const code = useRouteQuery('code', 'foo', { route, router })
    const search = useRouteQuery('search', null, { route, router })

    expectTypeOf(code.value).toEqualTypeOf<string | string[] | null>()
    expectTypeOf(search.value).toEqualTypeOf<string | string[] | null>()

    expect(code.value).toBe('foo')

    code.value = 'bar'

    expect(code.value).toBe('bar')
    expect(search.value).toBe('vue3')
  })

  it('should update the route', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const code = useRouteQuery('code', null, { route, router })
    const page = useRouteQuery('page', null, { route, router })
    const lang = useRouteQuery('lang', null, { route, router })

    expectTypeOf(code.value).toEqualTypeOf<string | string[] | null>()
    expectTypeOf(page.value).toEqualTypeOf<string | string[] | null>()
    expectTypeOf(lang.value).toEqualTypeOf<string | string[] | null>()

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

    const page = useRouteQuery('page', 2, { route, router })
    const lang = useRouteQuery('lang', 'pt-BR', { route, router })

    expectTypeOf(page.value).toEqualTypeOf<string | string[] | null | number>()
    expectTypeOf(lang.value).toEqualTypeOf<string | string[] | null>()

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
  })

  it('should reset state on scope dispose', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const scopeA = effectScope()
    const scopeB = effectScope()

    let page = deepRef<number | null>(null)
    let lang = deepRef<string | null>(null)
    let code = deepRef<string | null>(null)
    let search = deepRef<string | null>(null)

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

  it('should not reset params to default params is disposed from other scope', async () => {
    let route = getRoute()

    const router = { replace: (r: any) => route = r } as any
    const scopeA = effectScope()
    const scopeB = effectScope()

    route.query.page = 2

    const defaultPage = 'DEFAULT_PAGE'
    let page1 = deepRef<number | string | null>(null)
    await scopeA.run(async () => {
      page1 = useRouteQuery('page', defaultPage, { route, router })
    })

    let page2 = deepRef<number | null>(null)
    await scopeB.run(async () => {
      page2 = useRouteQuery('page', defaultPage, { route, router })
    })

    expect(page1.value).toBe(2)
    expect(page2.value).toBe(2)

    scopeA.stop()
    await nextTick()

    expect(page1.value).toBe(defaultPage)
    expect(page2.value).toBe(2)
  })

  it('should change the value when the route changes', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const page = useRouteQuery('page', null, { route, router })

    expectTypeOf(page.value).toEqualTypeOf<string | string[] | null>()

    expect(page.value).toBeNull()

    route.query = { page: '2' }

    expect(page.value).toBe('2')
  })

  it('should differentiate null and undefined when reading value', () => {
    let route = getRoute({
      page: 1,
    })
    const router = { replace: (r: any) => route = r } as any

    const lang = useRouteQuery('lang', undefined, { route, router })

    expectTypeOf(lang.value).toEqualTypeOf<string | string[] | null | undefined>()

    expect(lang.value).toBeUndefined()

    route.query = { ...route.query, lang: null }

    expect(lang.value).toBeNull()

    const code = useRouteQuery('code', null, { route, router })

    expectTypeOf(code.value).toEqualTypeOf<string | string[] | null>()

    expect(code.value).toBeNull()

    const page = useRouteQuery('page', null, { route, router })

    expectTypeOf(page.value).toEqualTypeOf<string | string[] | null>()

    expect(page.value).toBe(1)
  })

  it('should differentiate null and undefined when writing value', async () => {
    let route = getRoute({
      search: 'vue3',
    })
    const router = { replace: (r: any) => route = r } as any

    const search: Ref<Maybe<string>> = useRouteQuery('search', 'default', { route, router })

    expect(search.value).toBe('vue3')
    expect(route.query.search).toBe('vue3')

    search.value = null
    await nextTick()
    expect(route.query.search).toBeNull()

    search.value = undefined
    await nextTick()
    expect(route.query.search).toBeUndefined()
  })

  it('should avoid trigger effects when the value doesn\'t change', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const onUpdate = vi.fn()

    const page = useRouteQuery('page', 1, { transform: Number, route, router })

    expectTypeOf(page.value).toEqualTypeOf<number>()

    watch(page, onUpdate)

    page.value = 1

    await nextTick()

    expect(page.value).toBe(1)
    expect(route.query.page).toBeUndefined()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should trigger effects only once', async () => {
    const route = getRoute()
    const router = { replace: (r: any) => Object.assign(route, r) } as any
    const onUpdate = vi.fn()

    const page = useRouteQuery('page', 1, { transform: Number, route, router })

    expectTypeOf(page.value).toEqualTypeOf<number>()

    const pageObj = computed(() => ({
      page: page.value,
    }))

    watch(pageObj, onUpdate)

    page.value = 2

    await nextTick()
    await nextTick()

    expect(page.value).toBe(2)
    expect(route.query.page).toBe(2)
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('should trigger effects only once with getter object as watch source', async () => {
    const route = getRoute({ page: '1' })
    const router = { replace: (r: any) => {
      Object.keys(r.query).forEach(queryKey => r.query[queryKey] = String(r.query[queryKey]))
      return Object.assign(route, r)
    } } as any
    const onUpdate = vi.fn()

    const page = useRouteQuery('page', 1, { transform: Number, route, router })

    expectTypeOf(page.value).toEqualTypeOf<number>()

    watch(() => ({ page: page.value }), onUpdate)

    page.value = 2
    await nextTick()
    await nextTick()

    expect(page.value).toBe(2)
    expect(route.query.page).toBe('2')
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('should keep current query and hash', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    route.params = { foo: 'bar' }
    route.hash = '#hash'

    const id = useRouteQuery('id', null, { route, router })

    expectTypeOf(id.value).toEqualTypeOf<string | string[] | null>()

    id.value = '2'

    await nextTick()

    expect(id.value).toBe('2')
    expect(route.hash).toBe('#hash')
    expect(route.params).toEqual({ foo: 'bar' })
  })

  it('should allow ref or getter as default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const defaultPage = shallowRef(1)
    const defaultLang = () => 'pt-BR'

    const page = useRouteQuery('page', defaultPage, { route, router })
    const lang = useRouteQuery('lang', defaultLang, { route, router })

    expectTypeOf(page.value).toEqualTypeOf<string | string[] | number | null>()
    expectTypeOf(lang.value).toEqualTypeOf<string | string[] | null>()

    expect(page.value).toBe(1)
    expect(lang.value).toBe('pt-BR')

    page.value = 2
    lang.value = 'en-US'

    expect(page.value).toBe(2)
    expect(lang.value).toBe('en-US')
  })
  it('should handle entire query object', async () => {
    let route = getRoute({ id: '1', name: 'test' })
    let route2 = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const router2 = { replace: (r: any) => route2 = r } as any

    const query = useRouteQuery({ id: 'default', name: 'default', foo: 'default' }, { route, router })
    const query2 = useRouteQuery(null, { name: '/foo/[count]', route: route2, router: router2 })

    expectTypeOf(query.value).toEqualTypeOf<Merge<Record<string, Maybe<string | string[]>>, { id: string, name: string, foo: string }>>()
    expectTypeOf(query2.value).toEqualTypeOf<Record<string, Maybe<string | string[]>>>()

    expect(query.value).toEqual({ id: '1', name: 'test', foo: 'default' })
    expect(query2.value).toEqual({})

    query.value = { id: '2', name: 'vue' }
    // @ts-expect-error Type 'null' is not assignable to type 'Record<string, RouteQueryValue>'
    query2.value = null
    await nextTick()

    expect(route.query).toEqual({ id: '2', name: 'vue' })
    expect(route2.query).toEqual({})
  })

  it('should handle transform for entire query object', async () => {
    let route = getRoute({ count: '5' })
    const router = { replace: (r: any) => route = r } as any

    const query = useRouteQuery(
      { count: '0' },
      {
        transform: {
          get: v => ({ count: Number(v.count) }),
          set: v => ({ count: String(v.count) }),
        },
        route,
        router,
      },
    )

    expectTypeOf(query.value).toEqualTypeOf<{ count: number }>()

    expect(query.value).toEqual({ count: 5 })

    query.value = { count: 10 }
    await nextTick()

    expect(route.query.count).toBe('10')
  })
  it.each([{ value: 'default' }, { value: undefined }, { value: () => 'default' }])('should reset value when $value value', async ({ value }) => {
    let route = getRoute({
      search: 'vue3',
    })
    const router = { replace: (r: any) => route = r } as any

    const search: Ref<Maybe<string>> = useRouteQuery('search', 'default', { route, router })

    expect(search.value).toBe('vue3')
    expect(route.query.search).toBe('vue3')

    search.value = toValue(value)

    await nextTick()

    expect(route.query.search).toBeUndefined()
  })
})
