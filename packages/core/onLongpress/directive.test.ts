import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { promiseTimeout } from '@vueuse/shared'

import { vonLongPress } from './directive'
import type { LongPressOptions } from '.'

const App = defineComponent({
  props: {
    onLongPress: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div data-test="element" v-if="options" v-on-longpress="{handler: onLongPress, options}">Press me</div>
  <div data-test="element" v-else v-on-longpress="onLongPress">Press me</div>
  </template>
  `,
})

describe('vonLongPress', () => {
  let onLongPress = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onLongPress = vi.fn()
      wrapper = mount(App, {
        props: {
          onLongPress,
        },
        global: {
          directives: {
            'on-longpress': vonLongPress,
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
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onLongPress = vi.fn()
      const options: LongPressOptions = {
        delay: 1000,
      }
      wrapper = mount(App, {
        props: {
          onLongPress,
          options,
        },
        global: {
          directives: {
            'on-longpress': vonLongPress,
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
      expect(onLongPress).toHaveBeenCalledTimes(0)
      await promiseTimeout(500)
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })
  })
})
