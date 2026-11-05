import type { AnyFn } from '@vueuse/shared'
import type { UseNowOptions } from './index'
import { mount } from '@vue/test-utils'
import { useIntervalFn } from '@vueuse/shared'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRafFn } from '../useRafFn'
import { UseNow } from './component'
import { useNow } from './index'

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should get now timestamp by default', async () => {
    const now = useNow()

    expect(+now.value).toBeLessThanOrEqual(Date.now())
  })

  it('starts lazily if the scheduler is not immediate', () => {
    const initial = Date.now()
    const { now, resume } = useNow({
      controls: true,
      scheduler: (cb: AnyFn) => useRafFn(cb, { immediate: false }),
    })

    expect(+now.value).toBe(initial)
    vi.advanceTimersByTime(50)
    expect(+now.value).toBe(initial)

    resume()
    vi.advanceTimersByTime(50)
    expect(+now.value).toBeGreaterThan(initial)
  })

  it('should work with component', () => {
    const wrapper = mount({
      components: { UseNow },
      template: '<UseNow v-slot="{ now }">{{ +now }}</UseNow>',
    })
    expect(Number.parseInt(wrapper.text(), 10)).toBeLessThanOrEqual(Date.now())
  })

  function testControl(name: string, scheduler: NonNullable<UseNowOptions<true>['scheduler']>) {
    it(`should control now timestamp by ${name}`, async () => {
      let initial = Date.now()
      const { now, pause, resume } = useNow({ controls: true, scheduler })

      expect(+now.value).toBeGreaterThanOrEqual(initial)

      vi.advanceTimersByTime(50)

      expect(+now.value).toBeGreaterThan(initial)

      initial = +now.value

      pause()
      vi.advanceTimersByTime(50)

      expect(+now.value).toBe(initial)

      resume()
      vi.advanceTimersByTime(50)

      expect(+now.value).toBeGreaterThan(initial)
    })
  }

  testControl('requestAnimationFrame', cb => useRafFn(cb))
  testControl('interval', cb => useIntervalFn(cb, 50))
})
