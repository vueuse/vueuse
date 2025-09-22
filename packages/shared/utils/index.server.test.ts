import { describe, expect, it } from 'vitest'
import { isClient } from './is'

describe('is', () => {
  it('should not be client', () => {
    expect(isClient).toBeFalsy()
  })
})
