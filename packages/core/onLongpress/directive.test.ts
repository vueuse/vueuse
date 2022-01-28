import { defineComponent } from 'vue'
import type { LongpressOptions } from '@vueuse/core'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { promiseTimeout } from '@vueuse/shared'

import { vOnLongpress } from './directive'

const App = defineComponent({

  props: {
    onLongpress: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div data-test="element" v-if="options" v-on-longpress="{handler: onLongpress, options}">Press me</div>
  <div data-test="element" v-else v-on-longpress="onLongpress">Press me</div>
  </template>
  `,
})

describe('vOnLongpress', () => {
  let onLongpress = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onLongpress = vi.fn()
      wrapper = mount(App, {
        props: {
          onLongpress,
        },
        global: {
          directives: {
            'on-longpress': vOnLongpress,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should trigger longpress after 500ms', async() => {
      const element = wrapper.get('[data-test=element]')
      await element.trigger('pointerdown')
      await promiseTimeout(500)
      expect(onLongpress).toHaveBeenCalledTimes(1)
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onLongpress = vi.fn()
      const options: LongpressOptions = {
        delay: 1000,
      }
      wrapper = mount(App, {
        props: {
          onLongpress,
          options,
        },
        global: {
          directives: {
            'on-longpress': vOnLongpress,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should trigger longpress after 500ms', async() => {
      const element = wrapper.get('[data-test=element]')
      await element.trigger('pointerdown')
      await promiseTimeout(500)
      expect(onLongpress).toHaveBeenCalledTimes(0)
      await promiseTimeout(500)
      expect(onLongpress).toHaveBeenCalledTimes(1)
    })
  })
})
