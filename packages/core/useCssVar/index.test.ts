import { defaultWindow } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'
import { mount } from '../../.test'
import { useCssVar } from './index'

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

  it('should work with css variables', () => {
    document.documentElement.style.setProperty('--rootColor', 'red')

    const colorNoRef = useCssVar('--rootColor')

    expect(colorNoRef.value).toBe('red')
  })

  it('should use window.document.documentElement as default element if not set', async () => {
    const vm = mount(defineComponent({
      setup() {
        const color = '--color'
        const variable = useCssVar(color, undefined, { initialValue: 'red' })

        return {
          color,
          variable,
        }
      },
      render() {
        return h('div', { style: { color: 'var(--color)' } })
      },
    }))

    await nextTick()
    expect(vm.variable).toBe('red')
    expect(window.document.documentElement.style.getPropertyValue(vm.color)).toBe('red')
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
        const el = useTemplateRef<HTMLDivElement>('el')

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
    expect(vm.el?.style.getPropertyValue('--color')).toBe('blue')
  })

  it('should have existing value', async () => {
    const vm = mount(defineComponent({
      setup() {
        const el = useTemplateRef<HTMLDivElement>('el')

        const color = '--color'
        const variable = useCssVar(color, el)

        return {
          el,
          variable,
        }
      },
      render() {
        return h('div', { ref: 'el', style: { '--color': 'red' } })
      },
    }))

    await nextTick()
    expect(vm.variable).toBe('red')
    expect(window.getComputedStyle(vm.el!).getPropertyValue('--color')).toBe('red')
    expect(vm.el?.style.getPropertyValue('--color')).toBe('red')
  })

  it('should work when changing element', async () => {
    const vm = mount(defineComponent({
      setup() {
        const el = useTemplateRef<HTMLDivElement>('el')
        const el2 = useTemplateRef<HTMLDivElement>('el2')
        const target = shallowRef<HTMLDivElement | null>(null)

        const color = '--color'
        const variable = useCssVar(color, target, { initialValue: 'red' })

        function switchTarget() {
          if (target.value === el.value)
            target.value = el2.value
          else
            target.value = el.value
        }

        onMounted(() => {
          target.value = el.value
        })

        return {
          el,
          el2,
          target,
          variable,
          switchTarget,
        }
      },
      render() {
        return [h('div', { ref: 'el' }), h('div', { ref: 'el2' })]
      },
    }))

    await nextTick()
    expect(vm.variable).toBe('red')
    expect(vm.el?.style.getPropertyValue('--color')).toBe('red')

    vm.switchTarget()

    await nextTick()
    expect(vm.el2?.style.getPropertyValue('--color')).toBe('red')
    // should remove the property from the old element
    expect(vm.el?.style.getPropertyValue('--color')).toBe('')
  })

  it('should work when changing CSS variable name', async () => {
    const vm = mount(defineComponent({
      setup() {
        const el = useTemplateRef<HTMLDivElement>('el')
        const key = shallowRef('--color')
        const variable = useCssVar(key, el)

        function changeVar() {
          if (key.value === '--color')
            key.value = '--color-one'
          else
            key.value = '--color'
        }

        return {
          el,
          key,
          variable,
          changeVar,
        }
      },
      render() {
        return h('div', {
          ref: 'el',
          style: {
            '--color': 'red',
            '--color-one': 'blue',
          },
        })
      },
    }))

    await nextTick()
    expect(vm.variable).toBe('red')
    expect(vm.el?.style.getPropertyValue('--color')).toBe('red')

    vm.changeVar()
    await nextTick()
    expect(vm.variable).toBe('blue')
    expect(vm.el?.style.getPropertyValue('--color-one')).toBe('blue')

    vm.changeVar()
    await nextTick()
    expect(vm.variable).toBe('red')
    expect(vm.el?.style.getPropertyValue('--color')).toBe('red')
  })

  it('should handle ref target changing from element to undefined', async () => {
    const vm = mount(defineComponent({
      setup() {
        const el = useTemplateRef<HTMLDivElement>('el')
        const target = shallowRef<HTMLDivElement | null | undefined>(undefined)

        const color = '--test-color'
        const variable = useCssVar(color, target, { initialValue: 'green' })

        function setTarget() {
          target.value = el.value
        }

        function clearTarget() {
          target.value = undefined
        }

        return {
          el,
          target,
          variable,
          setTarget,
          clearTarget,
        }
      },
      render() {
        return h('div', { ref: 'el' })
      },
    }))

    await nextTick()

    // Initially target is undefined, should use documentElement
    expect(vm.variable).toBe('green')
    expect(document.documentElement.style.getPropertyValue('--test-color')).toBe('green')

    // Set target to actual element
    vm.setTarget()
    await nextTick()

    // Should now use the element and remove from documentElement
    expect(vm.el?.style.getPropertyValue('--test-color')).toBe('green')
    expect(document.documentElement.style.getPropertyValue('--test-color')).toBe('')

    // Clear target back to undefined
    vm.clearTarget()
    await nextTick()

    // Should NOT go back to documentElement since target had a value before
    expect(vm.el?.style.getPropertyValue('--test-color')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--test-color')).toBe('')

    // Clean up
    document.documentElement.style.removeProperty('--test-color')
  })
})
