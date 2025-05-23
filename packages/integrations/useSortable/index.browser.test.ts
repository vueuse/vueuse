import { mount } from '@vue/test-utils'
import { templateRef, unrefElement } from '@vueuse/core'
import Sortable from 'sortablejs'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, onMounted, shallowRef } from 'vue'
import { useSortable } from './index'

describe('useSortable', () => {
  it('should initialise Sortable', () => {
    const wrapper = mount(defineComponent({
      template: '<div ref="el"></div>',
      setup() {
        const el = templateRef<HTMLElement>('el')
        const list = shallowRef<string[]>([])
        const result = useSortable(el, list, {
        })

        return { ...result, el }
      },
    }))
    const vm = wrapper.vm
    try {
      const sortable = Sortable.get(vm.el)
      expect(sortable).toBeDefined()
    }
    finally {
      wrapper.unmount()
    }
  })

  it('should accept selectors as el', () => {
    const wrapper = mount(defineComponent({
      template: '<div ref="el" id="el"></div>',
      setup() {
        const el = templateRef<HTMLElement>('el')
        const list = shallowRef<string[]>([])
        const result = useSortable('#el', list, {
        })

        return { ...result, el }
      },
    }), {
      attachTo: document.body,
    })
    const vm = wrapper.vm
    try {
      const sortable = Sortable.get(vm.el)
      expect(sortable).toBeDefined()
    }
    finally {
      wrapper.unmount()
    }
  })

  describe('stop', () => {
    it('should destroy instance', () => {
      const wrapper = mount(defineComponent({
        template: '<div ref="el"></div>',
        setup() {
          const el = templateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el)
        expect(sortable).toBeDefined()
        vm.stop()
        expect(Sortable.get(vm.el)).toEqual(null)
      }
      finally {
        wrapper.unmount()
      }
    })
  })

  describe('start', () => {
    it('can recreate sortable after being stopped', () => {
      const wrapper = mount(defineComponent({
        template: '<div ref="el"></div>',
        setup() {
          const el = templateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el)
        expect(sortable).toBeDefined()
        vm.stop()
        expect(Sortable.get(vm.el)).toEqual(null)
        vm.start()
        expect(Sortable.get(vm.el)).toBeDefined()
      }
      finally {
        wrapper.unmount()
      }
    })
  })

  describe('option', () => {
    it('should set option in sortable', () => {
      const wrapper = mount(defineComponent({
        template: '<div ref="el"></div>',
        setup() {
          const el = templateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el)
        expect(sortable?.option('disabled')).toEqual(false)
        vm.option('disabled', true)
        expect(sortable?.option('disabled')).toEqual(true)
      }
      finally {
        wrapper.unmount()
      }
    })

    it('should get option in sortable', () => {
      const wrapper = mount(defineComponent({
        template: '<div ref="el"></div>',
        setup() {
          const el = templateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        expect(vm.option('disabled')).toEqual(false)
      }
      finally {
        wrapper.unmount()
      }
    })
  })

  it('accepts component refs', () => {
    const SubComponent = defineComponent({
      template: '<p>foo</p>',
    })
    const wrapper = mount(defineComponent({
      components: { SubComponent },
      template: '<SubComponent ref="el"></SubComponent>',
      setup() {
        const el = templateRef<InstanceType<typeof SubComponent>>('el')
        const list = shallowRef<string[]>([])
        const result = useSortable(el, list, {
        })

        return { ...result, el }
      },
    }))
    const vm = wrapper.vm
    try {
      const el = unrefElement(vm.el) as HTMLElement
      const sortable = Sortable.get(el)
      expect(sortable).toBeDefined()
    }
    finally {
      wrapper.unmount()
    }
  })

  it('should work when element rendered conditionally', async () => {
    const wrapper = mount(defineComponent({
      template: `<div v-if="isVisible" ref="el">
        <div v-for="el in list" :key="el.id">{{el.name}}</div>
      </div>`,
      setup() {
        const el = templateRef<HTMLDivElement>('el')

        const list = shallowRef([])
        const isVisible = shallowRef(false)

        const { isActive: sortableIsActive } = useSortable(el, list)

        function setVisible(value: boolean) {
          isVisible.value = value
        }

        return {
          el,
          isVisible,
          setVisible,
          sortableIsActive,
          list,
        }
      },
    }))

    const vm = wrapper.vm

    try {
      expect(vm.sortableIsActive).toBeFalsy()

      vm.setVisible(true)

      await nextTick()

      expect(vm.sortableIsActive).toBeTruthy()
      expect(Sortable.get(vm.el)).toBeDefined()

      vm.setVisible(false)

      await nextTick()

      expect(vm.sortableIsActive).toBeFalsy()
    }
    finally {
      wrapper.unmount()
    }
  })

  it('should work when changing element', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        const el = templateRef<HTMLDivElement>('el')
        const el2 = templateRef<HTMLDivElement>('el2')
        const target = shallowRef<HTMLDivElement | null>(null)

        const list = shallowRef([])

        useSortable(target, list)

        onMounted(() => {
          target.value = el.value
        })

        function switchTarget() {
          if (target.value === el.value)
            target.value = el2.value
          else
            target.value = el.value
        }

        return {
          el,
          el2,
          target,
          switchTarget,
          list,
        }
      },
      render() {
        return [
          h('div', { ref: 'el' }),
          h('div', { ref: 'el2' }),
        ]
      },
    }))

    const vm = wrapper.vm

    try {
      expect(Sortable.get(vm.el)).toBeUndefined()

      await nextTick()

      expect(Sortable.get(vm.el)).toBeDefined()
      expect(Sortable.get(vm.el2)).toBeUndefined()

      vm.switchTarget()

      await nextTick()

      expect(Sortable.get(vm.el)).toBeNull()
      expect(Sortable.get(vm.el2)).toBeDefined()
    }
    finally {
      wrapper.unmount()
    }
  })

  it('should work when changing element only once', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        const el = templateRef<HTMLDivElement>('el')
        const el2 = templateRef<HTMLDivElement>('el2')

        const isSwitched = shallowRef(false)
        const target = computed(() => isSwitched.value ? el2.value : el.value)

        const list = shallowRef([])

        useSortable(target, list, { watchOptions: { once: true } })

        function switchTarget() {
          isSwitched.value = !isSwitched.value
        }

        return {
          el,
          el2,
          target,
          switchTarget,
          list,
        }
      },
      render() {
        return [
          h('div', { ref: 'el' }),
          h('div', { ref: 'el2' }),
        ]
      },
    }))

    const vm = wrapper.vm

    try {
      expect(Sortable.get(vm.el)).toBeDefined()
      expect(Sortable.get(vm.el2)).toBeUndefined()

      vm.switchTarget()

      await nextTick()

      expect(Sortable.get(vm.el)).toBeNull()
      expect(Sortable.get(vm.el2)).toBeDefined()

      vm.switchTarget()

      await nextTick()

      expect(Sortable.get(vm.el)).toBeNull()
      expect(Sortable.get(vm.el2)).toBeDefined()
    }
    finally {
      wrapper.unmount()
    }
  })
})
