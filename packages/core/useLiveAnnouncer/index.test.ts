import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useLiveAnnouncer } from './index'

describe('useLiveAnnouncer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(useLiveAnnouncer).toBeDefined()
  })

  it('should create announcer elements on initialization', () => {
    useLiveAnnouncer()

    const container = document.getElementById('vueuse-live-announcer-container')
    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    const assertiveEl = document.getElementById('vueuse-live-announcer-assertive')

    expect(container).not.toBeNull()
    expect(politeEl).not.toBeNull()
    expect(assertiveEl).not.toBeNull()

    expect(politeEl?.getAttribute('aria-live')).toBe('polite')
    expect(politeEl?.getAttribute('role')).toBe('status')
    expect(politeEl?.getAttribute('aria-atomic')).toBe('true')

    expect(assertiveEl?.getAttribute('aria-live')).toBe('assertive')
    expect(assertiveEl?.getAttribute('role')).toBe('alert')
    expect(assertiveEl?.getAttribute('aria-atomic')).toBe('true')
  })

  it('should visually hide the container', () => {
    useLiveAnnouncer()

    const container = document.getElementById('vueuse-live-announcer-container')
    expect(container?.style.position).toBe('absolute')
    expect(container?.style.width).toBe('1px')
    expect(container?.style.height).toBe('1px')
    expect(container?.style.overflow).toBe('hidden')
    expect(container?.style.clipPath).toBe('inset(50%)')
  })

  it('should announce a polite message', async () => {
    const { polite } = useLiveAnnouncer()
    polite('Polite message')
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Polite message')
  })

  it('should announce an assertive message', async () => {
    const { assertive } = useLiveAnnouncer()
    assertive('Assertive message')
    await nextTick()

    const assertiveEl = document.getElementById('vueuse-live-announcer-assertive')
    expect(assertiveEl?.textContent).toBe('Assertive message')
  })

  it('should use polite mode by default for announce()', async () => {
    const { announce } = useLiveAnnouncer()
    announce('Default mode message')
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Default mode message')
  })

  it('should update the message ref', async () => {
    const { polite, assertive, message } = useLiveAnnouncer()

    polite('First')
    await nextTick()
    expect(message.value).toBe('First')

    assertive('Second')
    await nextTick()
    expect(message.value).toBe('Second')
  })

  it('should clear message after default timeout', async () => {
    vi.useFakeTimers()
    const { polite } = useLiveAnnouncer({ timeout: 1000 })

    polite('Temp message')
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Temp message')

    vi.advanceTimersByTime(999)
    expect(politeEl?.textContent).toBe('Temp message')

    vi.advanceTimersByTime(1)
    expect(politeEl?.textContent).toBe('')
  })

  it('should clear message after per-call timeout', async () => {
    vi.useFakeTimers()
    const { announce } = useLiveAnnouncer()

    announce('Temp', 'polite', 500)
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    expect(politeEl?.textContent).toBe('Temp')

    vi.advanceTimersByTime(500)
    expect(politeEl?.textContent).toBe('')
  })

  it('should clear previous timer when new announcement is made', async () => {
    vi.useFakeTimers()
    const { assertive } = useLiveAnnouncer()

    assertive('First', 1000)
    await nextTick()

    vi.advanceTimersByTime(500)
    assertive('Second', 1000)
    await nextTick()

    const assertiveEl = document.getElementById('vueuse-live-announcer-assertive')
    expect(assertiveEl?.textContent).toBe('Second')

    vi.advanceTimersByTime(500)
    expect(assertiveEl?.textContent).toBe('Second')

    vi.advanceTimersByTime(500)
    expect(assertiveEl?.textContent).toBe('')
  })

  it('should not auto-clear when timeout is 0', async () => {
    vi.useFakeTimers()
    const { polite } = useLiveAnnouncer({ timeout: 0 })

    polite('Persistent')
    await nextTick()

    const politeEl = document.getElementById('vueuse-live-announcer-polite')
    vi.advanceTimersByTime(10000)
    expect(politeEl?.textContent).toBe('Persistent')
  })

  it('should support custom idPrefix', async () => {
    const { announce } = useLiveAnnouncer({ idPrefix: 'custom' })
    announce('Test')
    await nextTick()

    expect(document.getElementById('custom-container')).not.toBeNull()
    expect(document.getElementById('custom-polite')).not.toBeNull()
    expect(document.getElementById('custom-assertive')).not.toBeNull()
    expect(document.getElementById('custom-polite')?.textContent).toBe('Test')
  })

  it('should not throw when document is undefined', () => {
    const { announce } = useLiveAnnouncer({ document: undefined })
    expect(() => announce('test')).not.toThrow()
  })

  it('should cleanup container when scope is disposed', () => {
    const scope = effectScope()

    scope.run(() => useLiveAnnouncer({ idPrefix: 'scope-test' }))
    expect(document.getElementById('scope-test-container')).not.toBeNull()

    scope.stop()
    expect(document.getElementById('scope-test-container')).toBeNull()
  })

  it('should handle reference counting for shared containers', () => {
    const scopeA = effectScope()
    const scopeB = effectScope()

    scopeA.run(() => useLiveAnnouncer({ idPrefix: 'shared' }))
    scopeB.run(() => useLiveAnnouncer({ idPrefix: 'shared' }))
    expect(document.getElementById('shared-container')).not.toBeNull()

    scopeA.stop()
    expect(document.getElementById('shared-container')).not.toBeNull()

    scopeB.stop()
    expect(document.getElementById('shared-container')).toBeNull()
  })

  it('should not throw when container is removed before dispose', () => {
    const scope = effectScope()
    scope.run(() => useLiveAnnouncer({ idPrefix: 'removed' }))

    document.getElementById('removed-container')?.remove()
    expect(() => scope.stop()).not.toThrow()
  })
})
