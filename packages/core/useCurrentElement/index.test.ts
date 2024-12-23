import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, shallowRef } from 'vue'
import { useCurrentElement } from '.'

// Manual triggering only works for Vue 3 - https://vueuse.org/shared/computedWithControl/#manual-triggering
describe('useCurrentElement', () => {
  it('should be defined', () => {
    expect(useCurrentElement).toBeDefined()
  })

  it('should return the root element from the current component', () => {
    const wrapper = mount({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const currentElement = useCurrentElement()

        return { el, currentElement }
      },
    })
    const vm = wrapper.vm

    expect(vm.currentElement).toBe(vm.el)
    wrapper.unmount()
  })

  it('should return the root element from the passed component', () => {
    const TestVueComponent = defineComponent({
      setup() {
        const rootEl = shallowRef<HTMLElement>()

        return { rootEl }
      },
      template: '<div ref="rootEl">Hello world</div>',
    })
    const wrapper = mount({
      components: {
        TestVueComponent,
      },
      template: `<p>
      Testing
      <TestVueComponent ref="el" />
      </p>`,
      setup() {
        const el = shallowRef()
        const currentElementEl = useCurrentElement(el)

        return { el, currentElementEl }
      },
    })
    const vm = wrapper.vm

    expect(vm.currentElementEl).toBe((vm.el as typeof TestVueComponent).rootEl)
    expect((vm.currentElementEl as HTMLElement).textContent).toBe('Hello world')
    wrapper.unmount()
  })
})
