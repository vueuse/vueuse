import { describe, expect, it } from 'vitest'
import { useNavigatorLanguage } from './index'

describe('useNavigatorLanguage', () => {
  it('should be defined', () => {
    expect(useNavigatorLanguage).toBeDefined()
  })

  it('should display the correct language', () => {
    const { language, isSupported } = useNavigatorLanguage()
    expect(isSupported.value).toBe(true)
    expect(language.value).toMatchInlineSnapshot(`"en-US"`)
  })
})
