import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { mount } from '../../.test'
import { useVForRefs } from '.'

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useVForRefs).toBeDefined()
  })

  it('should bind refs on mounted', async() => {
    const vm = mount(defineComponent({
      setup() {
        const list = [{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }]
        const { refs, setRef } = useVForRefs()

        return { list, refs, setRef }
      },
      template: '<div><template v-for="item in list" :key="item.id"><div :ref="setRef">{{item.value}}</div></template></div>',
    }))

    expect(vm.refs[0].innerHTML).toBe('foo')
    expect(vm.refs[1].innerHTML).toBe('bar')
  })

  it('should bind refs on updated', async() => {
    const vm = mount(defineComponent({
      setup() {
        const list = ref([{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }])
        const { refs, setRef } = useVForRefs()

        onMounted(() => {
          list.value.push({ id: 2, value: 'baz' }, { id: 3, value: 'qux' })
        })

        return { list, refs, setRef }
      },
      template: '<div><template v-for="item in list" :key="item.id"><div :ref="setRef">{{item.value}}</div></template></div>',
    }))

    await nextTick()
    expect(vm.refs[0].innerHTML).toBe('foo')
    expect(vm.refs[1].innerHTML).toBe('bar')
    expect(vm.refs[2].innerHTML).toBe('baz')
    expect(vm.refs[3].innerHTML).toBe('qux')
  })
})
