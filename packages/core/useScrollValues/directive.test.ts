import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vScrollValue } from './directive'
import type { UseScrollValueOptions } from '.'

const App = defineComponent({
  props: {
    onScroll: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-scroll="[onScroll,options]">Scroll me</div>
  <div v-else v-scroll="onScroll">Scroll me</div>
  </template>
  `,
})

describe('vScrollValue', () => {
  let onScroll = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onScroll = vi.fn()
      wrapper = mount(App, {
        props: {
          onScroll,
        },
        global: {
          directives: {
            scroll: vScrollValue,
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
      onScroll = vi.fn()
      const options: UseScrollValueOptions = {
        throttle: 10,
      }
      wrapper = mount(App, {
        props: {
          onScroll,
          options,
        },
        global: {
          directives: {
            scroll: vScrollValue,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
