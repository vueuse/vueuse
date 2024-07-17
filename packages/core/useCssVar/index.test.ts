import { defaultWindow } from '@vueuse/core'
import { nextTick } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useCssVar } from '.'

describe('useCssVar', () => {
  it('should be defined', () => {
    expect(useCssVar).toBeDefined()
  })

  it('should work', () => {
    const el = document.createElement('div')
    const color = '--color'
    const variable = useCssVar(color, el, { initialValue: 'red' })

    expect(variable.value).toBe('red')
  })

  it('should handle null and undefined', () => {
    const el = document.createElement('div')
    const property = '---color'
    const variable = useCssVar(property, el)

    expect(window?.getComputedStyle(el).getPropertyValue('--color')).toBe('')
    variable.value = 'red'
    setTimeout(() => {
      expect(window?.getComputedStyle(el).getPropertyValue('--color')).toBe('red')
    }, 100)
  })

  it('should work observe', async () => {
    const window = defaultWindow
    const el = document.createElement('div')
    window?.document.body.appendChild(el)

    const color = '--color'
    const variable = useCssVar(color, el, { initialValue: 'red', observe: true })

    expect(variable.value).toBe('red')

    el.style.setProperty(color, 'blue')
    await nextTick()
    expect(variable.value).toBe('blue')
  })
})
