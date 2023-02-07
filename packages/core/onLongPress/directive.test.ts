import { defineComponent, isVue3 } from 'vue-demi'

import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { promiseTimeout } from '@vueuse/shared'

import { VOnLongPress, vOnLongPress } from './directive'
import type { OnLongPressOptions } from '.'

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
  <div data-test="element" v-if="options" v-on-longpress="[onLongPress, options]">Press me</div>
  <div data-test="element" v-else v-on-longpress="onLongPress">Press me</div>
  </template>
  `,
})

describe('vOnLongPress', () => {
  let onLongPress = vi.fn()
  let wrapper: VueWrapper<any>

  it('export module', () => {
    expect(vOnLongPress).toBeDefined()
    expect(VOnLongPress).toBeDefined()
  })

  describe('given no options', () => {
    beforeEach(() => {
      onLongPress = vi.fn()
      wrapper = mount(App, {
        props: {
          onLongPress,
        },
        global: {
          directives: {
            'on-longpress': vOnLongPress,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it.runIf(isVue3)('should trigger longpress after 500ms', async () => {
      const element = wrapper.get('[data-test=element]')
      await element.trigger('pointerdown')
      await promiseTimeout(500)
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onLongPress = vi.fn()
      const options: OnLongPressOptions = {
        delay: 1000,
      }
      wrapper = mount(App, {
        props: {
          onLongPress,
          options,
        },
        global: {
          directives: {
            'on-longpress': vOnLongPress,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it.runIf(isVue3)('should trigger longpress after 500ms', async () => {
      const element = wrapper.get('[data-test=element]')
      await element.trigger('pointerdown')
      await promiseTimeout(500)
      expect(onLongPress).toHaveBeenCalledTimes(0)
      await promiseTimeout(500)
      expect(onLongPress).toHaveBeenCalledTimes(1)
    })
  })
})
