import { describe, expect, it } from 'vitest'
// import {} from 'vitest/browser'
import { useMediaQuery } from './index'

describe('useMediaQuery', () => {
  it('should handle simple queries', () => {
    expect(window.innerWidth).toBe(800)
    expect(useMediaQuery('(min-width: 700px)').value).toBe(true)
    expect(useMediaQuery('(max-width: 700px)').value).toBe(false)
  })
})
