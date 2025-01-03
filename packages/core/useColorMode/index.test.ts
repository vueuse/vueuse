import type { Ref } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useColorMode } from '.'
import { nextTwoTick } from '../../.test'
import { usePreferredDark } from '../usePreferredDark'

describe('useColorMode', () => {
  const storageKey = 'vueuse-color-scheme'
  const htmlEl = document.querySelector('html')

  vi.mock('../usePreferredDark', () => {
    const mockPreferredDark = ref(false)
    return {
      usePreferredDark: () => mockPreferredDark,
    }
  })

  const mockPreferredDark = usePreferredDark() as Ref<boolean>

  beforeEach(() => {
    mockPreferredDark.value = false
    localStorage.clear()
    htmlEl!.className = ''
  })

  afterAll(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should translate auto mode when prefer dark', async () => {
    const mode = useColorMode()
    mode.value = 'auto'
    mockPreferredDark.value = true
    await nextTwoTick()
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
    mockPreferredDark.value = true

    await nextTwoTick()
    expect(mode.value).toBe('auto')
    expect(localStorage.getItem(storageKey)).toBe('auto')
    expect(htmlEl?.className).toMatch(/dark/)
  })

  it('should be able access the store & system preference', () => {
    const mode = useColorMode()
    expect(mode.store.value).toBe('auto')
    expect(mode.system.value).toBe('light')
    expect(mode.state.value).toBe('light')
  })

  it('should call classList.add/classList.remove only if mode changed', async () => {
    const target = document.createElement('div')

    const mode = useColorMode({ selector: target, initialValue: 'light' })

    await nextTick()

    const addClass = vi.spyOn(target.classList, 'add')
    const removeClass = vi.spyOn(target.classList, 'remove')

    mode.value = 'light'

    await nextTick()

    expect(addClass).not.toHaveBeenCalled()
    expect(removeClass).not.toHaveBeenCalled()

    mode.value = 'dark'

    await nextTick()

    expect(addClass).toHaveBeenCalled()
    expect(removeClass).toHaveBeenCalled()
  })

  it('should call setAttribute only if mode changed', async () => {
    const target = document.createElement('div')

    const mode = useColorMode({ selector: target, initialValue: 'light', attribute: 'data-color-mode' })

    await nextTick()

    const setAttr = vi.spyOn(target, 'setAttribute')

    mode.value = 'light'

    await nextTick()

    expect(setAttr).not.toHaveBeenCalled()

    mode.value = 'dark'

    await nextTick()

    expect(setAttr).toHaveBeenCalled()
  })
})
