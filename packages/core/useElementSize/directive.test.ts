import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
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

  template: `<template>
  <div v-if="options" v-element-size="[onResize,options]">Hello world!</div>
  <div v-else v-element-size="onResize">Hello world!</div>
  </template>
  `,
})

describe('vElementSize', () => {
  let onResize = vi.fn()
  let wrapper: VueWrapper<any>

  let originalResizeObserver: any
  let resizeObserverCallback: Function | null = null
  let mockResizeObserver: any

  describe('given no options', () => {
    beforeEach(() => {
      originalResizeObserver = globalThis.ResizeObserver
      resizeObserverCallback = null
      mockResizeObserver = vi.fn().mockImplementation((callback: Function) => {
        resizeObserverCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      })
      globalThis.ResizeObserver = mockResizeObserver

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

    afterEach(() => {
      globalThis.ResizeObserver = originalResizeObserver
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')

      if (element && resizeObserverCallback) {
        resizeObserverCallback([{
          target: element,
          contentRect: {
            width: 200,
            height: 100,
          },
        }])

        await nextTick()
        expect(onResize).toBeCalledTimes(1)

        onResize.mockClear()
        wrapper.unmount()
        await nextTick()

        resizeObserverCallback([{
          target: element,
          contentRect: {
            width: 300,
            height: 100,
          },
        }])

        await nextTick()

        expect(onResize).toBeCalledTimes(0)
      }
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      originalResizeObserver = globalThis.ResizeObserver
      resizeObserverCallback = null
      mockResizeObserver = vi.fn().mockImplementation((callback: Function) => {
        resizeObserverCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      })
      globalThis.ResizeObserver = mockResizeObserver
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

    afterEach(() => {
      globalThis.ResizeObserver = originalResizeObserver
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')

      if (element && resizeObserverCallback) {
        resizeObserverCallback([{
          target: element,
          contentRect: {
            width: 200,
            height: 100,
          },
        }])

        await nextTick()
        expect(onResize).toBeCalledTimes(1)

        onResize.mockClear()
        wrapper.unmount()
        await nextTick()

        resizeObserverCallback([{
          target: element,
          contentRect: {
            width: 300,
            height: 100,
          },
        }])

        await nextTick()

        expect(onResize).toBeCalledTimes(0)
      }
    })
  })
})
