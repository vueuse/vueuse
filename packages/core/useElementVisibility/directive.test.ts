import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vElementVisibility } from './directive'
import type { UseElementVisibilityOptions } from '.'

const App = defineComponent({
  props: {
    onVisibility: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      require: false,
    },
  },

  template: `<template>
  <div v-if="options" v-element-visibility="onVisibility">Look me</div>
  <div v-else v-element-visibility="[onVisibility, options]">Look me</div>
  </template>
  `,
})

describe('vElementVisibility', () => {
  let onVisibility = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onVisibility = vi.fn()
      wrapper = mount(App, {
        props: {
          onVisibility,
        },
        global: {
          directives: {
            ElementVisibility: vElementVisibility,
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
      onVisibility = vi.fn()
      const options: UseElementVisibilityOptions = {
        scrollTarget: document.body,
      }
      wrapper = mount(App, {
        props: {
          onVisibility,
          options,
        },
        global: {
          directives: {
            ElementVisibility: vElementVisibility,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
