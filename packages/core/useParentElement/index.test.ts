import { describe, expect, it } from 'vitest'
import { ref as deepRef, defineComponent, h, nextTick } from 'vue'
import { mount } from '../../.test'
import { useParentElement } from './index'

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
    const liEl = deepRef()
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
