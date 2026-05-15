import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent } from 'vue'
import { vElementSize } from './directive'

const App = defineComponent({
  props: {
    onResize: {
      type: Function,
      required: true,
    },
    options: {
      type: Array,
      required: false,
    },
  },

  setup(props) {
    const bindingValue = computed(() => {
      if (props.options)
        return [props.onResize, ...props.options]

      return props.onResize
    })

    return {
      bindingValue,
    }
  },

  template: `<template>
  <div v-element-size="bindingValue">Hello world!</div>
  </template>
  `,
})

describe('vElementSize', () => {
  let onResize = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onResize = vi.fn()
      wrapper = mount(App, {
        props: {
          onResize,
        },
        global: {
          directives: {
            ElementSize: vElementSize,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onResize = vi.fn()
      const options = [{ width: 100, height: 100 }, { box: 'content-box' }]

      wrapper = mount(App, {
        props: {
          onResize,
          options,
        },
        global: {
          directives: {
            ElementSize: vElementSize,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should call resize handler immediately with border-box options', () => {
      const offsetWidth = vi
        .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
        .mockReturnValue(45)
      const offsetHeight = vi
        .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
        .mockReturnValue(30)

      try {
        wrapper.unmount()
        onResize = vi.fn()
        wrapper = mount(App, {
          props: {
            onResize,
            options: [{ width: 0, height: 0 }, { box: 'border-box' }],
          },
          global: {
            directives: {
              ElementSize: vElementSize,
            },
          },
        })

        expect(onResize).toHaveBeenCalledTimes(1)
        expect(onResize).toHaveBeenCalledWith({ width: 45, height: 30 })
      }
      finally {
        wrapper.unmount()
        offsetWidth.mockRestore()
        offsetHeight.mockRestore()
      }
    })
  })
})
