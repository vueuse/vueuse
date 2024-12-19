import { afterEach, describe, expect, it } from 'vitest'
import { setSSRWidth, useSSRWidth } from '.'

describe('useSSRWidth', () => {
  afterEach(() => {
    setSSRWidth(undefined)
  })

  it('should be undefined by default', () => {
    expect(useSSRWidth()).toBeUndefined()
  })

  it('should store the set value', () => {
    setSSRWidth(500)
    expect(useSSRWidth()).toBe(500)
  })

  it('should still be undefined', () => {
    expect(useSSRWidth()).toBeUndefined()
  })
})
