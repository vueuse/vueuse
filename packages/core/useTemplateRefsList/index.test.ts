import { defineComponent, h, isVue2, nextTick, ref, toRefs } from 'vue-demi'
import { mount } from '../../.test'
import { useTemplateRefsList } from '.'

if (isVue2) {
  // Vue 2 is not supported
  it('stub', () => {})
}
else {
  const Component1 = defineComponent({
    setup() {
      const list = ref([1, 2, 3])
      const refs = useTemplateRefsList()
      return { list, refs }
    },
    render() {
      return h(
        'div',
        this.list.map(item => h('div', {
          ref: this.refs.set,
          id: `div${item}`,
        })),
      )
    },
  })

  interface ChildAPI {
    foo: () => string
  }

  const Child = defineComponent({
    props: {
      id: {
        type: Number,
        required: true,
      },
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
      const refs = useTemplateRefsList<ChildAPI>()
      return { list, refs }
    },
    render() {
      return h(
        'div',
        this.list.map(item => h(Child, {
          ref: this.refs.set,
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
      const vm = mount(Component1)

      expect(vm.refs).toBeDefined()
      expect(vm.refs.length).toBe(3)
      expect(vm.refs[0]).toBe(vm.$el.querySelector('#div1'))
      expect(vm.refs[1]).toBe(vm.$el.querySelector('#div2'))
      expect(vm.refs[2]).toBe(vm.$el.querySelector('#div3'))
    })

    it('v-for source update', async () => {
      const vm = mount(Component1)

      vm.list = [1, 2, 3, 4]
      await nextTick()

      expect(vm.refs.length).toBe(4)
      expect(vm.refs[3]).toBe(vm.$el.querySelector('#div4'))
    })

    it('call child component methods', async () => {
      const vm = mount(testCom2)

      expect(vm.refs[0].foo()).toBe('foo1')
      expect(vm.refs[1].foo()).toBe('foo2')
      expect(vm.refs[2].foo()).toBe('foo3')
    })
  })
}
