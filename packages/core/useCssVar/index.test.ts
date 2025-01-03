import { defaultWindow } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
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

  it('should handle null and undefined', async () => {
    const el = document.createElement('div')
    const property = '--color'
    const variable = useCssVar(property, el)

    expect(el).toMatchInlineSnapshot(`<div />`)
    variable.value = 'red'
    await nextTick()
    expect(el).toMatchInlineSnapshot(`
      <div
        style="--color: red;"
      />
    `)
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
