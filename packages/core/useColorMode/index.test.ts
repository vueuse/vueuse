import { nextTwoTick } from 'packages/.test'
import { expect, vi } from 'vitest'
import { ref } from 'vue-demi'
import { usePreferredDark } from '../usePreferredDark'
import { useColorMode } from './index'

describe('useColorMode', () => {
  const storageKey = 'vueuse-color-scheme'
  const htmlEl = document.querySelector('html')

  vi.mock('../usePreferredDark', () => {
    const mockPreferredDark = ref(false)
    return {
      usePreferredDark: [true, ...new Array(8).fill(false), true].reduce((fn, v) => fn.mockImplementationOnce(() => {
        mockPreferredDark.value = v
        return mockPreferredDark
      }), vi.fn()),
    }
  })

  beforeEach(() => {
    localStorage.clear()
    htmlEl!.className = ''
  })

  afterAll(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should translate auto mode when prefer dark', () => {
    const mode = useColorMode()
    mode.value = 'auto'
    expect(mode.value).toBe('dark')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/dark/)
  })

  it('should translate auto mode', () => {
    const mode = useColorMode()
    mode.value = 'auto'
    expect(mode.value).toBe('light')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/light/)
  })

  it('should translate custom mode', async () => {
    const mode = useColorMode<'custom' | 'unknown'>({ modes: { custom: 'custom' } })
    mode.value = 'custom'

    await nextTwoTick()
    expect(mode.value).toBe('custom')
    expect(localStorage.getItem(storageKey)).toBe('custom')
    expect(htmlEl?.className).toMatch(/custom/)

    mode.value = 'unknown'

    await nextTwoTick()
    expect(mode.value).toBe('unknown')
    expect(localStorage.getItem(storageKey)).toBe('unknown')
    expect(htmlEl?.className).toBe('')
  })

  it('should include auto mode', () => {
    const mode = useColorMode({ emitAuto: true })
    mode.value = 'auto'
    expect(mode.value).toBe('auto')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/light/)
  })

  it('should not persist mode into localStorage', () => {
    const mode = useColorMode({ storageKey: null })
    mode.value = 'auto'
    expect(mode.value).toBe('light')
    expect(localStorage.getItem(storageKey)).toBeNull()
    expect(htmlEl?.className).toMatch(/light/)
  })

  it('should set html attribute to be mode', () => {
    const mode = useColorMode({ attribute: 'data-color-mode' })
    mode.value = 'auto'
    expect(mode.value).toBe('light')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.getAttribute('data-color-mode')).toBe('light')
  })

  it('should not affect html when selector invalid', () => {
    const mode = useColorMode({ selector: 'unknown' })
    mode.value = 'auto'
    expect(mode.value).toBe('light')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toBe('')
  })

  it('should call onChanged when mode changed', () => {
    let nextMode = null
    const onChanged = (mode: any, defaultOnChanged: any) => {
      nextMode = mode
      defaultOnChanged(mode)
    }
    const mode = useColorMode({ onChanged })
    mode.value = 'auto'
    expect(mode.value).toBe('light')
    expect(nextMode).toBe('light')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/light/)
  })

  it('should only change html class when preferred dark changed', async () => {
    const mode = useColorMode({ emitAuto: true })
    usePreferredDark()

    await nextTwoTick()
    expect(mode.value).toBe('auto')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/dark/)
  })
})
