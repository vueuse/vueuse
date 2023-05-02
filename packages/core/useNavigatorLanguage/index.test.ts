import { describe, expect, it } from 'vitest'
import { useNavigatorLanguage } from '.'

describe('useNavigatorLanguage', () => {
  it('should be defined', () => {
    expect(useNavigatorLanguage).toBeDefined()
  })
})
