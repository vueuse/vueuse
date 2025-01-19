import { defaultWindow } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, onMounted, ref } from 'vue'
import { useCssVar } from '.'
import { mount } from '../../.test'

describe('useCssVar', () => {
  it('should be defined', () => {
    expect(useCssVar).toBeDefined()
  })

  it('should work', () => {
    const el = document.createElement('div')

    const color = '--color'
    const variable = useCssVar(color, el, { initialValue: 'red' })

    expect(variable.value).toBe('red')
    expect(el.style.getPropertyValue(color)).toBe('red')
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
    expect(el.style.getPropertyValue(color)).toBe('red')

    el.style.setProperty(color, 'blue')
    await nextTick()
    expect(variable.value).toBe('blue')
    expect(el.style.getPropertyValue(color)).toBe('blue')
  })

  it('should work when changing color in onMounted', async () => {
    const vm = mount(defineComponent({
      setup() {
        const el = ref()

        const color = '--color'
        const variable = useCssVar(color, el)

        onMounted(() => {
          variable.value = 'blue'
        })

        return {
          el,
          variable,
        }
      },
      render() {
        return h('div', { ref: 'el' })
      },
    }))

    await nextTick()
    expect(vm.variable).toBe('blue')
    expect(vm.el.style.getPropertyValue('--color')).toBe('blue')
  })
})
