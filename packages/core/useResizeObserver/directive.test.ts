import type { VueWrapper } from '@vue/test-utils'
import type { UseResizeObserverOptions } from '.'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
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

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
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

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
