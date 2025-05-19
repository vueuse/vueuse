import { describe, expect, it } from 'vitest'
import { useNavigatorLanguage } from './index'

describe('useNavigatorLanguage', () => {
  it('should be defined', () => {
    expect(useNavigatorLanguage).toBeDefined()
  })
})
