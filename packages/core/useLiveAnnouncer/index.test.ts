import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useLiveAnnouncer } from './index'

describe('useLiveAnnouncer', () => {
  beforeEach(() => {
    // Clean up any existing live region before each test
    const existingRegion = document.getElementById('vueuse-live-announcer')
    if (existingRegion) {
      existingRegion.remove()
    }
  })

  afterEach(() => {
    // Clean up after each test
    const existingRegion = document.getElementById('vueuse-live-announcer')
    if (existingRegion) {
      existingRegion.remove()
    }
  })

  it('should create a live region element', async () => {
    const { announce } = useLiveAnnouncer()

    announce('Test message')

    // Wait for the setTimeout in announce
    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion).toBeTruthy()
    expect(liveRegion?.getAttribute('role')).toBe('status')
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite')
    expect(liveRegion?.getAttribute('aria-atomic')).toBe('true')
  })

  it('should announce a message with polite politeness', async () => {
    const { announce } = useLiveAnnouncer()

    announce('Hello world', 'polite')

    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite')
    expect(liveRegion?.textContent).toBe('Hello world')
  })

  it('should announce a message with assertive politeness', async () => {
    const { announce } = useLiveAnnouncer()

    announce('Critical alert', 'assertive')

    // Wait for the setTimeout in announce (50ms) plus buffer
    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.getAttribute('aria-live')).toBe('assertive')
    expect(liveRegion?.textContent).toBe('Critical alert')
  })

  it('should use polite shorthand', async () => {
    const { polite } = useLiveAnnouncer()

    polite('Polite message')

    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite')
    expect(liveRegion?.textContent).toBe('Polite message')
  })

  it('should use assertive shorthand', async () => {
    const { assertive } = useLiveAnnouncer()

    assertive('Assertive message')

    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.getAttribute('aria-live')).toBe('assertive')
    expect(liveRegion?.textContent).toBe('Assertive message')
  })

  it('should clear the announcement', async () => {
    const { announce, clear } = useLiveAnnouncer()

    announce('Test message')

    await new Promise(resolve => setTimeout(resolve, 100))

    clear()

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.textContent).toBe('')
  })

  it('should use default politeness when not specified', async () => {
    const { announce } = useLiveAnnouncer({ defaultPoliteness: 'assertive' })

    announce('Test')

    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    expect(liveRegion?.getAttribute('aria-live')).toBe('assertive')
  })

  it('should reuse existing live region', async () => {
    const { announce: announce1 } = useLiveAnnouncer()
    const { announce: announce2 } = useLiveAnnouncer()

    announce1('First')
    await new Promise(resolve => setTimeout(resolve, 100))

    announce2('Second')
    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegions = document.querySelectorAll('#vueuse-live-announcer')
    expect(liveRegions.length).toBe(1)
  })

  it('should hide live region visually but keep accessible', async () => {
    const { announce } = useLiveAnnouncer()

    announce('Hidden message')

    await new Promise(resolve => setTimeout(resolve, 100))

    const liveRegion = document.getElementById('vueuse-live-announcer')
    const styles = liveRegion?.style

    expect(styles?.position).toBe('absolute')
    expect(styles?.width).toBe('1px')
    expect(styles?.height).toBe('1px')
    expect(styles?.overflow).toBe('hidden')
  })
})
