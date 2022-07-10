import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vOnKeyStroke } from './directive'
import type { OnKeyStrokeOptions } from '.'

const App = defineComponent({
  props: {
    onUpdate: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-on-key-stroke="[onUpdate, options]">Hello world!</div>
  <div v-else v-on-key-stroke="onUpdate">Hello world!</div>
  </template>
  `,
})

describe('vOnKeyStroke', () => {
  let onUpdate = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onUpdate = vi.fn()
      wrapper = mount(App, {
        props: {
          onUpdate,
        },
        global: {
          directives: {
            'on-key-stroke': vOnKeyStroke,
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
      onUpdate = vi.fn()
      const options: OnKeyStrokeOptions = {
        passive: false,
      }
      wrapper = mount(App, {
        props: {
          onUpdate,
          options,
        },
        global: {
          directives: {
            'on-key-stroke': vOnKeyStroke,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
