import type { UseVibrateOptions } from './index'
import { useIntervalFn } from '@vueuse/shared'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { useVibrate } from './index'

describe('useVibrate', () => {
  it('allows omitting the scheduler option', () => {
    expectTypeOf({ pattern: [300, 100, 300] }).toExtend<UseVibrateOptions>()
  })

  it('does not create interval controls without scheduler', () => {
    const { intervalControls } = useVibrate({ pattern: [300, 100, 300] })

    expect(intervalControls).toBeUndefined()
  })

  it('creates interval controls with a scheduler', () => {
    const { intervalControls } = useVibrate({
      pattern: [300, 100, 300],
      scheduler: cb => useIntervalFn(cb, 1000, { immediate: false }),
    })

    expect(intervalControls).toBeDefined()
  })
})
