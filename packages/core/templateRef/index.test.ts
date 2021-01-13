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
      const $target = templateRef<HTMLElement | null>(refKey, null)
      return { $target }
    }, () => h('div', { ref: refKey }))

    expect(vm.$target).toBe(vm.$el)
  })

  it('string ref update', async() => {
    const vm = useSetupWithRender(() => {
      const refKey = ref('foo')
      const $foo = templateRef<HTMLElement | null>('foo', null)
      const $bar = templateRef<HTMLElement | null>('bar', null)
      return {
        refKey,
        $foo,
        $bar,
      }
    }, function() {
      return h('div', { ref: this.refKey })
    })

    expect(vm.$foo).toBe(vm.$el)
    expect(vm.$bar).toBe(null)

    vm.refKey = 'bar'
    await nextTick()

    expect(vm.$foo).toBe(null)
    expect(vm.$bar).toBe(vm.$el)
  })

  it('string ref unmount', async() => {
    const vm = useSetupWithRender(() => {
      const toggle = ref(true)
      const $target = templateRef<HTMLElement | null>('target', null)
      return {
        toggle,
        $target,
      }
    }, function() {
      return this.toggle ? h('div', { ref: 'target' }) : null
    })

    expect(vm.$target).toBe(vm.$el)

    vm.toggle = false
    await nextTick()

    expect(vm.$target).toBe(null)
  })
})
