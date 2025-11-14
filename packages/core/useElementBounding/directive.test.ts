import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vElementBounding } from './directive'

const App = defineComponent({
  props: {
    onBounding: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-element-bounding="[onBounding,options]">Hello world!</div>
  <div v-else v-element-bounding="onBounding">Hello world!</div>
  </template>
  `,
})

describe('vElementBounding', () => {
  let onBounding = vi.fn()
  let wrapper: VueWrapper<any>
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
  const mockGetBoundingClientRect = vi.fn(() => ({
    width: 100,
    height: 50,
    top: 0,
    right: 100,
    bottom: 50,
    left: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  }))

  describe('given no options', () => {
    beforeEach(() => {
      onBounding = vi.fn()
      wrapper = mount(App, {
        props: {
          onBounding,
        },
        global: {
          directives: {
            ElementBounding: vElementBounding,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      HTMLElement.prototype.getBoundingClientRect = mockGetBoundingClientRect
      const element = wrapper.element.querySelector('div')

      wrapper.unmount()
      await nextTick()
      if (element) {
        element.style.width = '300px'
        mockGetBoundingClientRect.mockReturnValue({
          width: 300,
          height: 50,
          top: 0,
          right: 300,
          bottom: 50,
          left: 0,
          x: 0,
          y: 0,
          toJSON: vi.fn(),
        })
        window.dispatchEvent(new Event('resize'))
        await nextTick()
        expect(onBounding).toBeCalledTimes(0)
      }
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onBounding = vi.fn()
      const options = {
        reset: true,
        windowResize: true,
        windowScroll: true,
        immediate: true,
        updateTiming: 'sync',
      }

      wrapper = mount(App, {
        props: {
          onBounding,
          options,
        },
        global: {
          directives: {
            ElementBounding: vElementBounding,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      HTMLElement.prototype.getBoundingClientRect = mockGetBoundingClientRect
      const element = wrapper.element.querySelector('div')

      wrapper.unmount()
      await nextTick()
      if (element) {
        element.style.width = '300px'
        mockGetBoundingClientRect.mockReturnValue({
          width: 300,
          height: 50,
          top: 0,
          right: 300,
          bottom: 50,
          left: 0,
          x: 0,
          y: 0,
          toJSON: vi.fn(),
        })
        window.dispatchEvent(new Event('resize'))
        await nextTick()
        expect(onBounding).toBeCalledTimes(0)
      }
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })
  })
})
