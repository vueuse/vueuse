import type { Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { computed, effectScope, nextTick, reactive, ref, watch } from 'vue'
import { useRouteParams } from '.'

describe('useRouteParams', () => {
  const getRoute = (params: Record<string, any> = {}) => reactive({
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

  it('should export', () => {
    expect(useRouteParams).toBeDefined()
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
    const route = getRoute()
    const router = {} as any

    const id = useRouteParams('id', '1', { transform: Number, route, router })

    expect(id.value).toBe(1)
  })

  it('should handle transform get/set', async () => {
    let route = getRoute({
      serialized: '{"foo":"bar"}',
    })
    const router = { replace: (r: any) => route = r } as any

    const object = useRouteParams('serialized', undefined, {
      transform: {
        get: (value: string) => JSON.parse(value),
        set: (value: any) => JSON.stringify(value),
      },
      router,
      route,
    })

    expect(object.value).toEqual({ foo: 'bar' })

    object.value = { foo: 'baz' }

    await nextTick()

    expect(route.params.serialized).toBe('{"foo":"baz"}')
    expect(object.value).toEqual({ foo: 'baz' })
  })

  it('should handle transform with only get', async () => {
    let route = getRoute({
      search: 'VUE3',
    })
    const router = { replace: (r: any) => route = r } as any

    const search = useRouteParams('search', undefined, {
      transform: {
        get: (value: string) => value.toLowerCase(),
      },
      router,
      route,
    })

    expect(search.value).toBe('vue3')
    expect(route.params.search).toBe('VUE3')
  })

  it('should handle transform with only set', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const search = useRouteParams('search', undefined, {
      transform: {
        set: (value: string) => value.toLowerCase(),
      },
      router,
      route,
    })

    search.value = 'VUE3'
    expect(search.value).toBe('vue3')

    await nextTick()

    expect(route.params.search).toBe('vue3')
  })

  it('should re-evaluate the value immediately', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const slug: Ref<any> = useRouteParams('slug', 'foo', { route, router })
    const id: Ref<any> = useRouteParams('id', '123', { route, router })
    const page: Ref<any> = useRouteParams('page', null, { route, router })

    slug.value = 'bar'
    id.value = '456'
    page.value = '2'

    expect(slug.value).toBe('bar')
    expect(id.value).toBe('456')
    expect(page.value).toBe('2')
  })

  it('should update the route', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const code: Ref<any> = useRouteParams('code', null, { route, router })
    const page: Ref<any> = useRouteParams('page', null, { route, router })
    const lang: Ref<any> = useRouteParams('lang', null, { route, router })

    code.value = 'bar'
    page.value = '1'
    lang.value = 'en'

    await nextTick()

    expect(code.value).toBe('bar')
    expect(route.params.code).toBe('bar')
    expect(page.value).toBe('1')
    expect(route.params.page).toBe('1')
    expect(lang.value).toBe('en')
    expect(route.params.lang).toBe('en')
  })

  it('should return default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const page: Ref<any> = useRouteParams('page', 10, { route, router })
    const lang: Ref<any> = useRouteParams('lang', 'pt-BR', { route, router })

    expect(page.value).toBe(10)
    expect(lang.value).toBe('pt-BR')
  })

  // docs @see https://router.vuejs.org/guide/essentials/route-matching-syntax.html#Optional-parameters
  it('should return default value when use vue-router optional parameters', () => {
    let route = getRoute({ page: '' })
    const router = { replace: (r: any) => route = r } as any

    const page: Ref<any> = useRouteParams('page', 'default', { route, router })

    expect(page.value).toBe('default')
  })

  it('should reset state on scope dispose', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const scopeA = effectScope()
    const scopeB = effectScope()

    let page: Ref<any> = ref(null)
    let lang: Ref<any> = ref(null)
    let code: Ref<any> = ref(null)
    let slug: Ref<any> = ref(null)

    await scopeA.run(async () => {
      page = useRouteParams('page', null, { route, router })
      lang = useRouteParams('lang', null, { route, router })

      page.value = 2
      lang.value = 'pt-BR'

      await nextTick()
    })

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
    expect(route.params.page).toBe(2)
    expect(route.params.lang).toBe('pt-BR')

    await scopeB.run(async () => {
      code = useRouteParams('code', null, { route, router })
      slug = useRouteParams('slug', null, { route, router })

      code.value = 'xyz'
      slug.value = 'vueuse'

      await nextTick()
    })

    expect(code.value).toBe('xyz')
    expect(slug.value).toBe('vueuse')
    expect(route.params.code).toBe('xyz')
    expect(route.params.slug).toBe('vueuse')

    scopeB.stop()

    expect(page.value).toBe(2)
    expect(lang.value).toBe('pt-BR')
    expect(code.value).toBeNull()
    expect(slug.value).toBeNull()

    scopeA.stop()

    expect(page.value).toBeNull()
    expect(lang.value).toBeNull()
  })

  it('should not reset params to default if is disposed from other scope', async () => {
    let route = getRoute()

    const router = { replace: (r: any) => route = r } as any

    const scopeA = effectScope()
    const scopeB = effectScope()

    route.params.page = 2

    const defaultPage = 'DEFAULT_PAGE'
    let page1: Ref<any> = ref(null)
    await scopeA.run(async () => {
      page1 = useRouteParams('page', defaultPage, { route, router })
    })

    let page2: Ref<any> = ref(null)
    await scopeB.run(async () => {
      page2 = useRouteParams('page', defaultPage, { route, router })
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

    const lang: Ref<any> = useRouteParams('lang', null, { route, router })

    expect(lang.value).toBeNull()

    route.params = { lang: 'en' }

    expect(lang.value).toBe('en')
  })

  it('should avoid trigger effects when the value doesn\'t change', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any
    const onUpdate = vi.fn()

    const page = useRouteParams('page', 1, { transform: Number, route, router })

    watch(page, onUpdate)

    page.value = 1

    await nextTick()

    expect(page.value).toBe(1)
    expect(route.params.page).toBeUndefined()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should trigger effects only once', async () => {
    const route = getRoute()
    const router = { replace: (r: any) => Object.assign(route, r) } as any
    const onUpdate = vi.fn()

    const page = useRouteParams('page', 1, { transform: Number, route, router })
    const pageObj = computed(() => ({
      page: page.value,
    }))

    watch(pageObj, onUpdate)

    page.value = 2

    await nextTick()
    await nextTick()

    expect(page.value).toBe(2)
    expect(route.params.page).toBe(2)
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('should trigger effects only once with getter object as watch source', async () => {
    const route = getRoute({ page: '1' })
    const router = { replace: (r: any) => {
      Object.keys(r.params).forEach(paramsKey => r.params[paramsKey] = String(r.params[paramsKey]))
      return Object.assign(route, r)
    } } as any
    const onUpdate = vi.fn()

    const page = useRouteParams('page', 1, { transform: Number, route, router })

    watch(() => ({ page: page.value }), onUpdate)

    page.value = 2
    await nextTick()
    await nextTick()

    expect(page.value).toBe(2)
    expect(route.params.page).toBe('2')
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('should keep current query and hash', async () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    route.query = { foo: 'bar' }
    route.hash = '#hash'

    const id: Ref<any> = useRouteParams('id', null, { route, router })

    id.value = '2'

    await nextTick()

    expect(id.value).toBe('2')
    expect(route.hash).toBe('#hash')
    expect(route.query).toEqual({ foo: 'bar' })
  })

  it('should allow ref or getter as default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const defaultPage = ref(1)
    const defaultLang = () => 'pt-BR'

    const page: Ref<any> = useRouteParams('page', defaultPage, { route, router })
    const lang: Ref<any> = useRouteParams('lang', defaultLang, { route, router })

    expect(page.value).toBe(1)
    expect(lang.value).toBe('pt-BR')

    page.value = 2
    lang.value = 'en-US'

    expect(page.value).toBe(2)
    expect(lang.value).toBe('en-US')
  })
})
