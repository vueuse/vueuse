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

  it('should use state to access mode & preference', () => {
    const state = useColorMode({}, 'state')
    expect(state.mode.value).toBe('auto')
    expect(state.preference.value).toBe('light')
    expect(state.isDark.value).toBe(false)
  })
})
