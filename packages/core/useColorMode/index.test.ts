import { expect } from 'vitest'
import { useColorMode } from '.'

describe('useColorMode', () => {
  it('should translate auto mode', () => {
    const mode = useColorMode()
    mode.value = 'auto'
    expect(mode.value).toBe('light')
  })

  it('should include auto mode', () => {
    const mode = useColorMode({ emitAuto: true })
    mode.value = 'auto'
    expect(mode.value).toBe('auto')
  })
})
