import type { EffectScope } from 'vue'
import type { UseElementVisibilityReturnWithControls } from './index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useElementVisibility } from './index'

let observers: MockIntersectionObserver[]

class MockIntersectionObserver {
  readonly root: Element | Document | null
  readonly rootMargin: string
  readonly thresholds: ReadonlyArray<number>
  readonly observe = vi.fn((element: Element) => {
    this.observedElements.push(element)
  })

  readonly unobserve = vi.fn((element: Element) => {
    this.observedElements = this.observedElements.filter(observed => observed !== element)
  })

  readonly disconnect = vi.fn(() => {
    this.observedElements = []
  })

  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => [])

  observedElements: Element[] = []

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.root = options.root ?? null
    this.rootMargin = options.rootMargin ?? ''
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    observers.push(this)
  }

  trigger(...entries: Array<{ isIntersecting: boolean, time: number, target?: Element }>) {
    this.callback(
      entries.map(entry => ({
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: entry.isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        isIntersecting: entry.isIntersecting,
        rootBounds: null,
        target: entry.target ?? this.observedElements[0] ?? document.createElement('div'),
        time: entry.time,
      } as IntersectionObserverEntry)),
      this as unknown as IntersectionObserver,
    )
  }
}

function runInScope<T>(fn: () => T) {
  const scope = effectScope()
  const result = scope.run(fn)

  if (result === undefined)
    throw new Error('Expected scoped function to return a value')

  return {
    result,
    scope,
  }
}

async function getObserver(index = 0) {
  await nextTick()
  expect(observers[index]).toBeDefined()
  return observers[index]
}

describe('useElementVisibility', () => {
  let el: HTMLDivElement
  let scopes: EffectScope[]

  beforeEach(() => {
    el = document.createElement('div')
    scopes = []
    observers = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    scopes.forEach(scope => scope.stop())
    vi.unstubAllGlobals()
  })

  function useScopedVisibility<T>(fn: () => T) {
    const scoped = runInScope(fn)
    scopes.push(scoped.scope)
    return scoped.result
  }

  it('should work when el is not an element', async () => {
    const visible = useScopedVisibility(() => useElementVisibility(null))

    await nextTick()

    expect(visible.value).toBeFalsy()
    expect(observers).toHaveLength(0)
  })

  it('should work when window is undefined', async () => {
    // @ts-expect-error set window null
    const visible = useScopedVisibility(() => useElementVisibility(el, { window: null }))

    await nextTick()

    expect(visible.value).toBeFalsy()
    expect(observers).toHaveLength(0)
  })

  it('should work when threshold is undefined', async () => {
    // @ts-expect-error set threshold null
    const visible = useScopedVisibility(() => useElementVisibility(el, { threshold: null }))

    await getObserver()

    expect(visible.value).toBeFalsy()
  })

  it('should allow set initial value', () => {
    const visible = useScopedVisibility(() => useElementVisibility(el, { initialValue: true }))

    expect(visible.value).toBeTruthy()
  })

  it('observes the given element and updates visibility from intersection entries', async () => {
    const visible = useScopedVisibility(() => useElementVisibility(el))
    const observer = await getObserver()

    expect(observer.observe).toHaveBeenCalledWith(el)
    expect(visible.value).toBe(false)

    observer.trigger({ isIntersecting: false, time: 1 })
    expect(visible.value).toBe(false)

    observer.trigger({ isIntersecting: true, time: 2 })
    expect(visible.value).toBe(true)

    observer.trigger({ isIntersecting: false, time: 3 })
    expect(visible.value).toBe(false)
  })

  it('should control visibility observer', async () => {
    const visibilityState = useScopedVisibility(
      () => useElementVisibility(el, { controls: true }) as UseElementVisibilityReturnWithControls,
    )
    const observer = await getObserver()

    expect(visibilityState.isVisible.value).toBe(false)
    expect(visibilityState.isActive.value).toBe(true)

    observer.trigger({ isIntersecting: true, time: 1 })
    expect(visibilityState.isVisible.value).toBe(true)
  })

  it('uses the latest version of isIntersecting when multiple intersection entries are given', async () => {
    const visible = useScopedVisibility(() => useElementVisibility(el))
    const observer = await getObserver()

    expect(visible.value).toBe(false)

    observer.trigger(
      { isIntersecting: false, time: 1 },
      { isIntersecting: false, time: 2 },
      { isIntersecting: true, time: 3 },
    )
    expect(visible.value).toBe(true)

    observer.trigger(
      { isIntersecting: true, time: 1 },
      { isIntersecting: false, time: 3 },
      { isIntersecting: true, time: 2 },
    )
    expect(visible.value).toBe(false)
  })

  it('passes root, rootMargin, and threshold options to IntersectionObserver', async () => {
    const scrollTarget = document.createElement('div')
    const threshold = [0, 0.5, 1]

    useScopedVisibility(() =>
      useElementVisibility(el, {
        rootMargin: '0px 0px 100px 0px',
        scrollTarget,
        threshold,
      }),
    )
    const observer = await getObserver()

    expect(observer.root).toBe(scrollTarget)
    expect(observer.rootMargin).toBe('0px 0px 100px 0px')
    expect(observer.thresholds).toEqual(threshold)
  })

  it('stops the observer after the first visibility change when once is true', async () => {
    useScopedVisibility(() => useElementVisibility(el, { once: true }))
    const observer = await getObserver()

    observer.trigger({ isIntersecting: false, time: 1 })
    observer.trigger({ isIntersecting: false, time: 2 })
    expect(observer.disconnect).not.toHaveBeenCalled()

    observer.trigger({ isIntersecting: true, time: 3 })
    expect(observer.disconnect).toHaveBeenCalledTimes(1)

    observer.trigger({ isIntersecting: false, time: 4 })
    observer.trigger({ isIntersecting: true, time: 5 })
    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })

  it('does not stop the observer when once is false (default)', async () => {
    useScopedVisibility(() => useElementVisibility(el))
    const observer = await getObserver()

    observer.trigger({ isIntersecting: true, time: 1 })

    expect(observer.disconnect).not.toHaveBeenCalled()
  })

  it('disconnects the observer when the active scope is disposed', async () => {
    const scoped = runInScope(() => useElementVisibility(el))
    const observer = await getObserver()

    scoped.scope.stop()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })

  it('disconnects the previous observer when the target element changes', async () => {
    const nextEl = document.createElement('div')
    const target = shallowRef<HTMLElement | null>(el)

    useScopedVisibility(() => useElementVisibility(target))
    const firstObserver = await getObserver()

    target.value = nextEl
    const secondObserver = await getObserver(1)

    expect(firstObserver.disconnect).toHaveBeenCalledTimes(1)
    expect(secondObserver.observe).toHaveBeenCalledWith(nextEl)
  })
})
