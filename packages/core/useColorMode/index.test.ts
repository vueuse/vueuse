import { expect } from 'vitest'
import { useColorMode } from '.'

describe('useColorMode', () => {
  it('should omit auto mode', () => {
    const mode = useColorMode()
    mode.value = 'auto'
    expect(mode.value).toBe('light')
  })

  it('should include auto mode', () => {
    const mode = useColorMode({ omitAuto: false })
    mode.value = 'auto'
    expect(mode.value).toBe('auto')
  })
})
