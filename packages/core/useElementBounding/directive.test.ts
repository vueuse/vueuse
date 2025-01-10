import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
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
  })
})
