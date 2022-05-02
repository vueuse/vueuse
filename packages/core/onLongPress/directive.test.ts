import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vOnLongPress } from './directive'
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
  })
})
