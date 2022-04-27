import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vInfiniteScroll } from './directive'
import type { UseInfiniteScrollOptions } from '.'

const App = defineComponent({
  props: {
    onInfiniteScroll: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-infinite-scroll="[onInfiniteScroll,options]">Hello world!</div>
  <div v-else v-infinite-scroll="onInfiniteScroll">Hello world!</div>
  </template>
  `,
})

describe('vInfiniteScroll', () => {
  let onInfiniteScroll = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onInfiniteScroll = vi.fn()
      wrapper = mount(App, {
        props: {
          onInfiniteScroll,
        },
        global: {
          directives: {
            'infinite-scroll': vInfiniteScroll,
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
      onInfiniteScroll = vi.fn()
      const options: UseInfiniteScrollOptions = {
        distance: 10,
      }
      wrapper = mount(App, {
        props: {
          onInfiniteScroll,
          options,
        },
        global: {
          directives: {
            'infinite-scroll': vInfiniteScroll,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
