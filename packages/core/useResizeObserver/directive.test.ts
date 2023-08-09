import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue-demi'
import { vResizeObserver } from './directive'
import type { UseResizeObserverOptions } from '.'

const App = defineComponent({
  props: {
    onResize: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },
  template: `<template>
  <div v-if="options" v-resize-observer="[onResize, options]">
    Hello world!
  </div>
  <div v-else v-resize-observer="onResize">Hello world!</div>
  </template>`,
})

describe('vResizeObserver', () => {
  let wrapper: VueWrapper<any>
  const onResize = vi.fn()

  describe('given no options', () => {
    beforeEach(() => {
      wrapper = mount(App, {
        global: {
          directives: { 'resize-observer': vResizeObserver },
        },
        props: {
          onResize,
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      const options: UseResizeObserverOptions = {
        box: 'device-pixel-content-box',
      }

      wrapper = mount(App, {
        global: {
          directives: { 'resize-observer': vResizeObserver },
        },
        props: {
          onResize,
          options,
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
