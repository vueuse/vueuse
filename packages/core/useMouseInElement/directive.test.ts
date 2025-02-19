import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vMouseInElement } from './directive'

const App = defineComponent({
  props: {
    onMouseInElement: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-mouse-in-element="[onMouseInElement,options]">Hello world!</div>
  <div v-else v-mouse-in-element="onMouseInElement">Hello world!</div>
  </template>
  `,
})

describe('vMouseInElement', () => {
  let onMouseInElement = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onMouseInElement = vi.fn()
      wrapper = mount(App, {
        props: {
          onMouseInElement,
        },
        global: {
          directives: {
            MouseInElement: vMouseInElement,
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
      onMouseInElement = vi.fn()
      const options = {}

      wrapper = mount(App, {
        props: {
          onMouseInElement,
          options,
        },
        global: {
          directives: {
            MouseInElement: vMouseInElement,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
