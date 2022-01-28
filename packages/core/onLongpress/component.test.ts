import { promiseTimeout } from '@vueuse/shared'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { defineComponent } from 'vue'
import type { LongpressOptions } from '@vueuse/core'
import { OnLongpress } from './component'

const App = defineComponent({
  components: {
    OnLongpress,
  },
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
  <OnLongpress data-test="element" :options="options" @trigger="onLongpress">Press me</OnLongpress>
  </template>
  `,
})

describe('OnLongpress', () => {
  let onLongpress = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onLongpress = vi.fn()
      wrapper = mount(App, {
        props: {
          onLongpress,
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
