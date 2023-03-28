import { defineComponent, h, nextTick, ref } from 'vue-demi'
import { mount } from '../../.test'
import { useParentElement } from '.'

describe('useParentElement', () => {
  it('should be defined', () => {
    expect(useParentElement).toBeDefined()
  })

  it('should work without ref', async () => {
    let parentElement: any

    const Child = defineComponent({
      setup() {
        parentElement = useParentElement()
        return () => h('div', {})
      },
    })

    mount({
      setup() {
        return () => h('parent', h(Child))
      },
    })

    await nextTick()

    expect(parentElement.value!.tagName).to.equal('PARENT')
  })

  it('should accept ref', async () => {
    const liEl = ref()
    const parentElement = useParentElement(liEl)

    mount(defineComponent({
      setup() {
        return () => h('ul', {}, [
          h('li', { ref: liEl }),
        ])
      },
    }))

    await nextTick()

    expect(parentElement.value!.tagName).to.equal('UL')
  })
})
