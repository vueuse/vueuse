import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { UseDark } from './component'
import { useDark } from './index'

describe('useDark', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('updates html element by default', async () => {
    const toggle = useDark({
      initialValue: 'light',
    })

    expect(toggle.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    toggle.value = true

    await nextTick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('updates custom element', async () => {
    const toggle = useDark({
      initialValue: 'light',
      selector: 'body',
    })

    expect(toggle.value).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)

    toggle.value = true

    await nextTick()

    expect(document.body.classList.contains('dark')).toBe(true)
  })

  it('updates custom storage key', async () => {
    const toggle = useDark({
      initialValue: 'light',
      storageKey: 'custom-key',
    })

    expect(localStorage.getItem('custom-key')).toBe('light')

    toggle.value = true

    await nextTick()

    expect(localStorage.getItem('custom-key')).toBe('dark')
  })

  it('sets custom class name', async () => {
    const toggle = useDark({
      initialValue: 'light',
      valueDark: 'custom-dark',
      valueLight: 'custom-light',
    })

    expect(toggle.value).toBe(false)
    expect(document.documentElement.classList.contains('custom-dark')).toBe(false)
    expect(document.documentElement.classList.contains('custom-light')).toBe(true)

    toggle.value = true

    await nextTick()

    expect(document.documentElement.classList.contains('custom-dark')).toBe(true)
    expect(document.documentElement.classList.contains('custom-light')).toBe(false)
  })

  it('calls custom change handler', async () => {
    let ready = false

    const onChanged = vi.fn((val, defaultHandler, mode) => {
      if (!ready)
        return // <- ignore immediate watch calls, only assert our changes

      expect(val).toBe(true)
      expect(defaultHandler).toBeInstanceOf(Function)
      expect(mode).toBe('dark')
      defaultHandler(mode)
    })

    const toggle = useDark({
      initialValue: 'light',
      onChanged,
    })

    ready = true
    toggle.value = true

    await nextTick()

    expect(onChanged).toHaveBeenCalled()
  })

  it('component', async () => {
    const wrapper = mount({
      render: () => h(UseDark, { initialValue: 'light' }, {
        default: ({ toggleDark }: any) => h('button', { onClick: toggleDark }),
      }),
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)

    wrapper.find('button').trigger('click')

    await nextTick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
