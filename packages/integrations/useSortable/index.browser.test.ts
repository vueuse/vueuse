import { mount } from '@vue/test-utils'
import { unrefElement } from '@vueuse/core'
import Sortable from 'sortablejs'
import { describe, expect, it } from 'vitest'
import { defineComponent, shallowRef, useTemplateRef } from 'vue'
import { useSortable } from './index'

describe('useSortable', () => {
  it('should initialize Sortable', () => {
    const wrapper = mount(defineComponent({
      template: '<div ref="el"></div>',
      setup() {
        const el = useTemplateRef<HTMLElement>('el')
        const list = shallowRef<string[]>([])
        const result = useSortable(el, list, {
        })

        return { ...result, el }
      },
    }))
    const vm = wrapper.vm
    try {
      const sortable = Sortable.get(vm.el!)
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
        const el = useTemplateRef<HTMLElement>('el')
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
      const sortable = Sortable.get(vm.el!)
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
          const el = useTemplateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()
        vm.stop()
        expect(Sortable.get(vm.el!)).toEqual(null)
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
          const el = useTemplateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()
        vm.stop()
        expect(Sortable.get(vm.el!)).toEqual(null)
        vm.start()
        expect(Sortable.get(vm.el!)).toBeDefined()
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
          const el = useTemplateRef<HTMLElement>('el')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
          })

          return { ...result, el }
        },
      }))
      const vm = wrapper.vm
      try {
        const sortable = Sortable.get(vm.el!)
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
          const el = useTemplateRef<HTMLElement>('el')
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
        const el = useTemplateRef<InstanceType<typeof SubComponent>>('el')
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

  describe('watchElement', () => {
    it('should auto-reinitialize when element changes with watchElement: true', async () => {
      const wrapper = mount(defineComponent({
        template: '<div v-if="show" ref="el"></div>',
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const show = shallowRef(true)
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
            watchElement: true,
          })

          return { ...result, el, show }
        },
      }))
      const vm = wrapper.vm
      try {
        await wrapper.vm.$nextTick()

        expect(vm.el).toBeDefined()
        let sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()

        vm.show = false
        await wrapper.vm.$nextTick()
        expect(vm.el).toBeNull()

        vm.show = true
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()
        expect(vm.el).toBeDefined()

        // Should be automatically reinitialized
        sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()
      }
      finally {
        wrapper.unmount()
      }
    })

    it('should NOT auto-reinitialize when element changes with watchElement: false', async () => {
      const wrapper = mount(defineComponent({
        template: '<div v-if="show" ref="el"></div>',
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const show = shallowRef(true)
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
            watchElement: false,
          })

          return { ...result, el, show }
        },
      }))
      const vm = wrapper.vm
      try {
        expect(vm.el).toBeDefined()
        const firstElement = vm.el!
        let sortable = Sortable.get(firstElement)
        expect(sortable).toBeDefined()
        const firstInstance = sortable

        vm.show = false
        await wrapper.vm.$nextTick()
        expect(vm.el).toBeNull()

        vm.show = true
        await wrapper.vm.$nextTick()
        expect(vm.el).toBeDefined()
        const secondElement = vm.el!

        expect(secondElement).not.toBe(firstElement)

        // New element should not have Sortable
        sortable = Sortable.get(secondElement)
        expect(sortable).toBeFalsy()

        // Old instance still bound to removed element
        sortable = Sortable.get(firstElement)
        expect(sortable).toBe(firstInstance)

        // Manual cleanup and reinitialize required
        vm.stop()
        vm.start()
        sortable = Sortable.get(secondElement)
        expect(sortable).toBeDefined()
      }
      finally {
        wrapper.unmount()
      }
    })

    it('should work with conditional rendering using watchElement: true', async () => {
      const wrapper = mount(defineComponent({
        template: `
          <div>
            <div v-if="condition === 'a'" ref="el" data-test="a"></div>
            <div v-if="condition === 'b'" ref="el" data-test="b"></div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const condition = shallowRef<'a' | 'b'>('a')
          const list = shallowRef<string[]>([])
          const result = useSortable(el, list, {
            watchElement: true,
          })

          return { ...result, el, condition }
        },
      }))
      const vm = wrapper.vm
      try {
        await wrapper.vm.$nextTick()

        expect(vm.el?.getAttribute('data-test')).toBe('a')
        let sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()
        const firstInstance = sortable

        vm.condition = 'b'
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()
        expect(vm.el?.getAttribute('data-test')).toBe('b')

        // Should be a new instance
        sortable = Sortable.get(vm.el!)
        expect(sortable).toBeDefined()
        expect(sortable).not.toBe(firstInstance)
      }
      finally {
        wrapper.unmount()
      }
    })
  })
})
