import { defineComponent, h, nextTick, ref, toRefs } from 'vue-demi'
import { mount } from '../../.test'
import { useTemplateRefsList } from '.'

const testCom1 = defineComponent({
  setup() {
    const list = ref([1, 2, 3])
    const [divs, setDiv] = useTemplateRefsList()
    return { list, divs, setDiv }
  },
  render() {
    return h(
      'div',
      this.list.map(item => h('div', {
        ref: this.setDiv,
        id: `div${item}`,
      })),
    )
  },
})

interface childComApi {
  foo: () => string
}

const childCom = defineComponent({
  props: {
    id: Number,
  },
  setup(props) {
    const { id } = toRefs(props)
    const foo = () => {
      return `foo${id.value}`
    }
    return { foo }
  },
  render() {
    return h('div')
  },
})

const testCom2 = defineComponent({
  setup() {
    const list = ref([1, 2, 3])
    const [coms, setCom] = useTemplateRefsList<childComApi>()
    return { list, coms, setCom }
  },
  render() {
    return h(
      'div',
      this.list.map(item => h(childCom, {
        ref: this.setCom,
        id: item,
      })),
    )
  },
})

describe('useTemplateRefsList', () => {
  it('should be defined', () => {
    expect(useTemplateRefsList).toBeDefined()
  })

  it('ref all 3 divs', () => {
    const vm = mount(testCom1)

    expect(vm.divs).toBeDefined()
    expect(vm.divs.length).toBe(3)
    expect(vm.divs[0]).toBe(vm.$el.querySelector('#div1'))
    expect(vm.divs[1]).toBe(vm.$el.querySelector('#div2'))
    expect(vm.divs[2]).toBe(vm.$el.querySelector('#div3'))
  })

  it('v-for source update', async() => {
    const vm = mount(testCom1)

    vm.list = [1, 2, 3, 4]
    await nextTick()

    expect(vm.divs.length).toBe(4)
    expect(vm.divs[3]).toBe(vm.$el.querySelector('#div4'))

    vm.list = [1]
    await nextTick()

    expect(vm.divs.length).toBe(1)
  })

  it('call child component methods', async() => {
    const vm = mount(testCom2)

    expect(vm.coms[0].foo()).toBe('foo1')
    expect(vm.coms[1].foo()).toBe('foo2')
    expect(vm.coms[2].foo()).toBe('foo3')
  })
})
