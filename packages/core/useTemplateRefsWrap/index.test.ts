import { defineComponent, h } from 'vue-demi'
import { mount } from '../../.test'
import { useTemplateRefsWrap, useHtmlElementTemplateRefs, useSvgElementTemplateRefs } from '.'

describe('useTemplateRefsWrap', () => {
  it('should be defined', () => {
    expect(useTemplateRefsWrap).toBeDefined()
  })

  it('must have div#t1', () => {
    const componentId = 't1'
    const vm = mount(defineComponent({
      setup() {
        const { t1 } = useTemplateRefsWrap<HTMLDivElement>()([componentId])
        return { t1 }
      },
      render() {
        return h('div', { ref: 't1', id: componentId })
      },
    }))

    expect(vm.t1).toBeDefined()
    expect(vm.t1).toBeTruthy()
    expect(vm.t1?.id).toBe(componentId)
  })
})

it('divs #t1, #t2, #t3 must be mounted', () => {
  const componentIdList = ['t1', 't2', 't3']
  const vm = mount(defineComponent({
    setup() {
      const { t1, t2, t3 } = useTemplateRefsWrap<HTMLDivElement>()(componentIdList)
      return { t1, t2, t3 }
    },
    render() {
      return h(
        'div',
        componentIdList.map(id => h('div', { id, ref: id })),
      )
    },
  }))
  expect(vm.t1).toBeTruthy()
  expect(vm.t2).toBeTruthy()
  expect(vm.t3).toBeTruthy()
  expect(vm.t1?.id).toBe(componentIdList[0])
  expect(vm.t2?.id).toBe(componentIdList[1])
  expect(vm.t3?.id).toBe(componentIdList[2])
})

it('a div #t1 and svg #t2 must be mounted', () => {
  const vm = mount(defineComponent({
    setup() {
      const { t1 } = useHtmlElementTemplateRefs(['t1'])
      const { t2 } = useSvgElementTemplateRefs(['t2'])
      return { t1, t2 }
    },
    render() {
      return h('div',
        [
          h('div', { ref: 't1', id: 't1' }),
          h('svg', { ref: 't2', id: 't2' }),
        ],
      )
    },
  }))

  expect(vm.t1).toBeTruthy()
  expect(vm.t2).toBeTruthy()
  expect(vm.t1?.tagName).toBe('DIV')
  expect(vm.t2?.tagName).toBe('svg')
  expect(vm.t1?.id).toBe('t1')
  expect(vm.t2?.id).toBe('t2')
})
