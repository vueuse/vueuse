import { defineComponent, h, nextTick, ref, VNode } from 'vue-demi'
import { mount } from '../../.test'
import { templateRef } from '.'

function useSetupWithRender<V>(setup: () => V, render: (this: V) => VNode | VNode[] | null) {
  const Comp = defineComponent({
    setup,
    render,
  })

  return mount(Comp)
}

describe('templateRef', () => {
  it('should be defined', () => {
    expect(templateRef).toBeDefined()
  })

  it('string ref mount', () => {
    const refKey = 'target'
    const vm = useSetupWithRender(() => {
      const targetEl = templateRef<HTMLElement | null>(refKey, null)
      return { targetEl }
    }, () => h('div', { ref: refKey }))

    expect(vm.targetEl).toBe(vm.$el)
  })

  it('string ref update', async() => {
    const vm = useSetupWithRender(() => {
      const refKey = ref('foo')
      const fooEl = templateRef<HTMLElement | null>('foo', null)
      const barEl = templateRef<HTMLElement | null>('bar', null)
      return {
        refKey,
        fooEl,
        barEl,
      }
    }, function() {
      return h('div', { ref: this.refKey })
    })

    expect(vm.fooEl).toBe(vm.$el)
    expect(vm.barEl).toBe(null)

    vm.refKey = 'bar'
    await nextTick()

    expect(vm.fooEl).toBe(null)
    expect(vm.barEl).toBe(vm.$el)
  })

  it('string ref unmount', async() => {
    const vm = useSetupWithRender(() => {
      const toggle = ref(true)
      const targetEl = templateRef<HTMLElement | null>('target', null)
      return {
        toggle,
        targetEl,
      }
    }, function() {
      return this.toggle ? h('div', { ref: 'target' }) : null
    })

    expect(vm.targetEl).toBe(vm.$el)

    vm.toggle = false
    await nextTick()

    expect(vm.targetEl).toBe(null)
  })
})
