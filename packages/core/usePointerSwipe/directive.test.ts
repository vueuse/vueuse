import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vPointerSwipe } from './directive'

const App = defineComponent({
  props: {
    onSwipe: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-pointer-swipe="[onSwipe,options]">Hello world!</div>
  <div v-else v-pointer-swipe="onSwipe">Hello world!</div>
  </template>
  `,
})

describe('vPointerSwipe', () => {
  let onSwipe = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onSwipe = vi.fn()
      wrapper = mount(App, {
        props: {
          onSwipe,
        },
        global: {
          directives: {
            PointerSwipe: vPointerSwipe,
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
      onSwipe = vi.fn()
      const options = {}

      wrapper = mount(App, {
        props: {
          onSwipe,
          options,
        },
        global: {
          directives: {
            PointerSwipe: vPointerSwipe,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
