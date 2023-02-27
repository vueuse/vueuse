import { defaultWindow } from '@vueuse/core'
import { nextTick } from 'vue-demi'
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
