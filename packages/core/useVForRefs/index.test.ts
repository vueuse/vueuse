import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { mount } from '../../.test'
import { useVForRefs } from '.'

const keyedVFor = `
<div v-for="item in list" :key="item.id" :ref="setRef">
  {{ item.value }}
</div>
`

const keyedTemplateVFor = `
<template v-for="item in list" :key="item.id">
  <div :ref="setRef">
    {{ item.value }}
  </div>
</template>
`

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useVForRefs).toBeDefined()
  })

  describe('keyed v-for', () => {
    it('should bind refs on mounted', async() => {
      const vm = mount(defineComponent({
        setup() {
          const list = [{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }]
          const { refs, setRef } = useVForRefs()

          return { list, refs, setRef }
        },
        template: keyedVFor,
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
        template: keyedVFor,
      }))

      await nextTick()
      expect(vm.refs[0].innerHTML).toBe('foo')
      expect(vm.refs[1].innerHTML).toBe('bar')
      expect(vm.refs[2].innerHTML).toBe('baz')
      expect(vm.refs[3].innerHTML).toBe('qux')
    })

    it('should update order of refs on updated', async() => {
      const vm = mount(defineComponent({
        setup() {
          const list = ref([{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }])
          const { refs, setRef } = useVForRefs()

          onMounted(() => {
            [list.value[0], list.value[1]] = [list.value[1], list.value[0]]
          })

          return { list, refs, setRef }
        },
        template: keyedVFor,
      }))

      await nextTick()
      expect(vm.refs[0].innerHTML).toBe('bar')
      expect(vm.refs[1].innerHTML).toBe('foo')
    })
  })

  describe('keyed template v-for', () => {
    it('should bind refs on mounted', async() => {
      const vm = mount(defineComponent({
        setup() {
          const list = [{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }]
          const { refs, setRef } = useVForRefs()

          return { list, refs, setRef }
        },
        template: keyedTemplateVFor,
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
        template: keyedTemplateVFor,
      }))

      await nextTick()
      expect(vm.refs[0].innerHTML).toBe('foo')
      expect(vm.refs[1].innerHTML).toBe('bar')
      expect(vm.refs[2].innerHTML).toBe('baz')
      expect(vm.refs[3].innerHTML).toBe('qux')
    })

    it('should update order of refs on updated', async() => {
      const vm = mount(defineComponent({
        setup() {
          const list = ref([{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }])
          const { refs, setRef } = useVForRefs()

          onMounted(() => {
            [list.value[0], list.value[1]] = [list.value[1], list.value[0]]
          })

          return { list, refs, setRef }
        },
        template: keyedTemplateVFor,
      }))

      await nextTick()
      expect(vm.refs[0].innerHTML).toBe('bar')
      expect(vm.refs[1].innerHTML).toBe('foo')
    })
  })
})
