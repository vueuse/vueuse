import { describe, expect, it, vi } from 'vitest'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRouteHash } from '.'

describe('useRouteHash', () => {
  const getRoute = (hash?: any) => reactive({
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

  it('should export', () => {
    expect(useRouteHash).toBeDefined()
  })

  it('should return current value', () => {
    let route = getRoute('header')
    const router = { replace: (r: any) => route = r } as any

    const hash = useRouteHash(null, { route, router })

    expect(hash.value).toBe(route.hash)
  })

  it('should re-evaluate the value immediately', () => {
    let route = getRoute('header')
    const router = { replace: (r: any) => route = r } as any

    const hash = useRouteHash(null, { route, router })

    hash.value = 'footer'

    expect(hash.value).toBe('footer')
  })

  it('should update the route', async () => {
    let route = getRoute('foo')
    const router = { replace: (r: any) => route = r } as any

    const hash = useRouteHash(null, { route, router })

    hash.value = 'footer'

    await nextTick()

    expect(hash.value).toBe('footer')
    expect(route.hash).toBe('footer')
  })

  it('should return default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const hash = useRouteHash('baz', { route, router })

    expect(hash.value).toBe('baz')
    expect(route.hash).toBeUndefined()
  })

  it('should change the value when the route changes', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const hash = useRouteHash('baz', { route, router })

    route.hash = 'foo'

    expect(hash.value).toBe('foo')
  })

  it('should trigger effects only once', async () => {
    const route = getRoute()
    const router = { replace: (r: any) => Object.assign(route, r) } as any
    const onUpdate = vi.fn()

    const hash = useRouteHash('baz', { route, router })
    const hashObj = computed(() => ({
      hash: hash.value,
    }))

    watch(hashObj, onUpdate)

    hash.value = 'foo'

    await nextTick()
    await nextTick()

    expect(hash.value).toBe('foo')
    expect(route.hash).toBe('foo')
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('should allow ref or getter as default value', () => {
    let route = getRoute()
    const router = { replace: (r: any) => route = r } as any

    const defaultTarget = ref('foo')

    const target = useRouteHash(defaultTarget, { route, router })

    expect(target.value).toBe('foo')

    target.value = 'bar'

    expect(target.value).toBe('bar')
  })
})
