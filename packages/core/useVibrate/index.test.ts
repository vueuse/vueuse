import type { UseVibrateOptions } from './index'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { useVibrate } from './index'

describe('useVibrate', () => {
  it('allows omitting deprecated interval option', () => {
    expectTypeOf({ pattern: [300, 100, 300] }).toExtend<UseVibrateOptions>()
  })

  it('does not create interval controls without interval or scheduler', () => {
    const { intervalControls } = useVibrate({ pattern: [300, 100, 300] })

    expect(intervalControls).toBeUndefined()
  })

  it('keeps interval option for backwards compatibility', () => {
    const { intervalControls } = useVibrate({ interval: 1000 })

    expect(intervalControls).toBeDefined()
  })
})
