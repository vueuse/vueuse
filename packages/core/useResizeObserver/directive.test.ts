import type { VueWrapper } from '@vue/test-utils'
import type { UseResizeObserverOptions } from './index'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vResizeObserver } from './directive'

const App = defineComponent({
  props: {
    onResizeObserver: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-resize-observer="[onResizeObserver,options]">Hello world!</div>
  <div v-else v-resize-observer="onResizeObserver">Hello world!</div>
  </template>
  `,
})

describe('vResizeObserver', () => {
  let onResizeObserver = vi.fn()
  let wrapper: VueWrapper<any>
  globalThis.ResizeObserver = vi.fn().mockImplementation((callback) => {
    return {
      observe: vi.fn((target) => {
        callback([{ contentRect: { width: target.offsetWidth || 0 } }], this)
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  })

  describe('given no options', () => {
    beforeEach(() => {
      onResizeObserver = vi.fn()
      wrapper = mount(App, {
        props: {
          onResizeObserver,
        },
        global: {
          directives: {
            'resize-observer': vResizeObserver,
          },
        },
      })
    })

    const observer = new ResizeObserver(onResizeObserver)

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')
      if (element) {
        observer.observe(element)
        element.style.width = '200px'
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(onResizeObserver).toBeCalledTimes(1)

        observer.disconnect()
        wrapper.unmount()
        onResizeObserver.mockClear()
        await nextTick()

        element.style.width = '300px'
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(onResizeObserver).toBeCalledTimes(0)
      }
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onResizeObserver = vi.fn()
      const options: UseResizeObserverOptions = {
        box: 'border-box',
      }
      wrapper = mount(App, {
        props: {
          onResizeObserver,
          options,
        },
        global: {
          directives: {
            'resize-observer': vResizeObserver,
          },
        },
      })
    })

    const observer = new ResizeObserver(onResizeObserver)

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')
      if (element) {
        observer.observe(element)
        element.style.width = '200px'
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(onResizeObserver).toBeCalledTimes(1)

        observer.disconnect()
        wrapper.unmount()
        onResizeObserver.mockClear()
        await nextTick()

        element.style.width = '300px'
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(onResizeObserver).toBeCalledTimes(0)
      }
    })
  })
})
