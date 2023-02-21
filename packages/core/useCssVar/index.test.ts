import { useCssVar } from '.'

describe('useCssVar', () => {
  it('should be defined', () => {
    expect(useCssVar).toBeDefined()
  })

  it('should work', () => {
    const el = document.createElement('div')
    const color = '--color'
    el.style.setProperty(color, 'red')
    const variable = useCssVar(color, el)

    expect(variable.value).toBe('red')

    el.style.setProperty(color, 'blue')
    expect(variable.value).toBe('blue')
  })
})
