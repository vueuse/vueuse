import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { onMounted, ref } from 'vue'
import { useCaretPosition } from '.'

describe('useCaretPosition', () => {
  it('should be defined', () => {
    expect(useCaretPosition).toBeDefined()
  })

  it('should return the inital position', () => {
    const wrapper = mount({
      template: '<input value="testing is cool" ref="el">',
      setup() {
        const el = ref<HTMLInputElement>()
        const { position } = useCaretPosition(el)

        return { el, position }
      },
    })
    const vm = wrapper.vm

    expect(vm.position).toMatchInlineSnapshot(`15`)
    wrapper.unmount()
  })

  it('should update the position on focus', () => {
    const wrapper = mount({
      template: '<input value="testing is cool" ref="el">',
      setup() {
        const el = ref<HTMLInputElement>()
        const { position } = useCaretPosition(el)

        onMounted(() => {
          el.value?.focus()
        })

        return { el, position }
      },

    })
    const vm = wrapper.vm

    expect(vm.position).toMatchInlineSnapshot(`15`)
    wrapper.unmount()
  })
})
