import { defineComponent, h, ref } from 'vue-demi'
import { mount } from '../../.test'
import { useParentElement } from '.'

describe('useParentElement', () => {
  it('should be defined', () => {
    expect(useParentElement).toBeDefined()
  })

  it('should accept ref', () => {
    const liEl = ref()
    const vm = mount(defineComponent({
      setup() {
        return () => h('ul', {}, [
          h('li', { ref: liEl }),
        ])
      },
    }))

    const { parentElement } = useParentElement(liEl)

    expect(parentElement.value.tagName).to.equal('UL')
  })
})
