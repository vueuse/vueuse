import * as shared from '@vueuse/shared'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useLiveAnnouncer } from './index'

describe('useLiveAnnouncer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should be defined', () => {
    expect(useLiveAnnouncer).toBeDefined()
  })

  it('should create announcer elements', async () => {
    const { announce } = useLiveAnnouncer()
    announce('Test message')
    await nextTick()

    const container = document.getElementById('vueuse-live-announcer-container')
    const polite = document.getElementById('vueuse-live-announcer-polite')
    const assertive = document.getElementById('vueuse-live-announcer-assertive')

    expect(container).not.toBeNull()
    expect(polite).not.toBeNull()
    expect(assertive).not.toBeNull()

    expect(polite?.getAttribute('aria-live')).toBe('polite')
    expect(polite?.getAttribute('role')).toBe('status')
    expect(polite?.textContent).toBe('Test message')

    expect(assertive?.getAttribute('aria-live')).toBe('assertive')
    expect(assertive?.getAttribute('role')).toBe('alert')
  })

  it('should support polite announcement', async () => {
    const { polite } = useLiveAnnouncer()
    polite('Polite message')
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Polite message')
  })

  it('should support assertive announcement', async () => {
    const { assertive } = useLiveAnnouncer()
    assertive('Assertive message')
    await nextTick()

    const assertiveEl = document.getElementById('vueuse-live-announcer-assertive')
    expect(assertiveEl?.textContent).toBe('Assertive message')
  })

  it('should clear message after timeout', async () => {
    vi.useFakeTimers()
    const { announce } = useLiveAnnouncer()
    const timeout = 500

    announce('Temp message', 'polite', timeout)
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Temp message')

    vi.advanceTimersByTime(timeout - 10)
    expect(politeEl?.textContent).toBe('Temp message')

    vi.advanceTimersByTime(20)
    expect(politeEl?.textContent).toBe('')
  })

  it('should clear previous timer when new announcement is made', async () => {
    vi.useFakeTimers()
    const { assertive } = useLiveAnnouncer()

    assertive('First message', 1000)
    await nextTick()

    vi.advanceTimersByTime(500)
    assertive('Second message', 1000)
    await nextTick()

    const assertiveEl = document.getElementById('vueuse-live-announcer-assertive')
    expect(assertiveEl?.textContent).toBe('Second message')

    vi.advanceTimersByTime(500)
    expect(assertiveEl?.textContent).toBe('Second message')

    vi.advanceTimersByTime(500)
    expect(assertiveEl?.textContent).toBe('')
  })

  it('should support custom idPrefix', async () => {
    const { announce } = useLiveAnnouncer({ idPrefix: 'custom-announcer' })
    announce('Custom prefix message')
    await nextTick()

    const container = document.getElementById('custom-announcer-container')
    const polite = document.getElementById('custom-announcer-polite')
    const assertive = document.getElementById('custom-announcer-assertive')

    expect(container).not.toBeNull()
    expect(polite).not.toBeNull()
    expect(assertive).not.toBeNull()
    expect(polite?.textContent).toBe('Custom prefix message')
  })

  it('should handle undefined document', () => {
    // @ts-expect-error mock window without document
    const { announce } = useLiveAnnouncer({ window: {} })
    expect(() => announce('test')).not.toThrow()
  })

  it('should cleanup container when scope is disposed', () => {
    const scope = effectScope()

    scope.run(() => useLiveAnnouncer({ idPrefix: 'test-scope' }))
    expect(document.getElementById('test-scope-container')).not.toBeNull()

    scope.stop()
    expect(document.getElementById('test-scope-container')).toBeNull()
  })

  it('should handle reference counting correctly', () => {
    const scope = effectScope()
    const sharedScopeA = effectScope()
    const sharedScopeB = effectScope()

    scope.run(() => useLiveAnnouncer({ idPrefix: 'test-scope-1' }))
    sharedScopeA.run(() => useLiveAnnouncer({ idPrefix: 'test-scope-2' }))
    sharedScopeB.run(() => useLiveAnnouncer({ idPrefix: 'test-scope-2' }))
    expect(document.getElementById('test-scope-1-container')).not.toBeNull()
    expect(document.getElementById('test-scope-2-container')).not.toBeNull()

    scope.stop()
    expect(document.getElementById('test-scope-1-container')).toBeNull()
    expect(document.getElementById('test-scope-2-container')).not.toBeNull()

    sharedScopeA.stop()
    expect(document.getElementById('test-scope-1-container')).toBeNull()
    expect(document.getElementById('test-scope-2-container')).not.toBeNull()

    sharedScopeB.stop()
    expect(document.getElementById('test-scope-1-container')).toBeNull()
    expect(document.getElementById('test-scope-2-container')).toBeNull()
  })

  it('should handle missing DOM elements', () => {
    const scope = effectScope()
    scope.run(() => useLiveAnnouncer({ idPrefix: 'defensive' }))
    const container = document.getElementById('defensive-container')
    container?.remove()
    scope.stop()
  })

  it('should handle invalid parameters', () => {
    const { announce } = useLiveAnnouncer({ idPrefix: 'defensive-2' })
    const secondContainer = document.getElementById('defensive-2-container')
    secondContainer?.remove()
    // @ts-expect-error testing invalid mode fallback
    expect(() => announce('test', 'invalid')).not.toThrow()
  })

  it('should handle manual cleanup', () => {
    let capturedCleanup: (() => void) | undefined
    const spy = vi.spyOn(shared, 'tryOnScopeDispose').mockImplementation((fn) => {
      capturedCleanup = fn as () => void
      return true
    })
    useLiveAnnouncer({ idPrefix: 'manual-test' })
    if (capturedCleanup) {
      capturedCleanup()
      expect(() => capturedCleanup!()).not.toThrow()
    }
    spy.mockRestore()
  })
})
