import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
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
  <div v-if="options" v-element-size="[onResize,...options]">Hello world!</div>
  <div v-else v-element-size="onResize">Hello world!</div>
  </template>
  `,
})

describe('vElementSize', () => {
  let onResize = vi.fn()
  let wrapper: VueWrapper<any>

  afterEach(() => {
    vi.restoreAllMocks()
  })

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
  })

  describe('given border-box options', () => {
    beforeEach(() => {
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(45)
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(
        35,
      )

      onResize = vi.fn()
      const options = [{ width: 0, height: 0 }, { box: 'border-box' }]

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

    it('calls the handler with the mounted border-box size', () => {
      expect(wrapper).toBeDefined()
      expect(onResize).toHaveBeenCalledTimes(1)
      expect(onResize).toHaveBeenCalledWith({ width: 45, height: 35 })
    })
  })
})
