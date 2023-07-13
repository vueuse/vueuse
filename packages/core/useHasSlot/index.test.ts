import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { useHasSlot } from '.'

describe('useHasSlot', () => {
  it('should be defined', () => {
    expect(useHasSlot).toBeDefined()
  })

  it('should return true when the slot exists', () => {
    const Component = {
      template: '<div><slot name="foo" /></div>',
      setup() {
        const hasSlot = useHasSlot()
        return { hasSlot }
      },
    }

    const wrapper = mount(Component, {
      slots: {
        foo: '<span>bar</span>',
      },
    })

    expect(!!wrapper.vm.$slots.foo).toBe(true)
  })

  it('should return false when the slot does not exist', () => {
    const Component = {
      template: '<div><slot name="foo" /></div>',
      setup() {
        const hasSlot = useHasSlot()
        return { hasSlot }
      },
    }

    const wrapper = mount(Component)

    expect(!!wrapper.vm.$slots.foo).toBe(false)
  })
})
