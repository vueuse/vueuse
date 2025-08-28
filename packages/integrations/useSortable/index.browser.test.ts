import { mount } from '@vue/test-utils'
import { unrefElement } from '@vueuse/core'
import Sortable from 'sortablejs'
import { describe, expect, it } from 'vitest'
import { defineComponent, shallowRef, useTemplateRef } from 'vue'
import { useSortable } from './index'

describe('useSortable', () => {
  it('should initialise Sortable', () => {
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
})
