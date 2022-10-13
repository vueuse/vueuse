import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { promiseTimeout } from '@vueuse/shared'

import { vElementHover } from './directive'
import type { UseElementHoverOptions } from '.'

const App = defineComponent({
  props: {
    onHover: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      require: false,
    },
  },

  template: `<template>
  <div data-test="element" v-if="options" v-element-hover="[onHover, { delay: 500 }]">Hover me (500ms)</div>
  <div v-else v-element-hover="onHover">Hover me</div>
  </template>
  `,
})

describe('vElementHover', () => {
  let onHover = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onHover = vi.fn()
      wrapper = mount(App, {
        props: {
          onHover,
        },
        global: {
          directives: {
            elementHover: vElementHover,
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
      onHover = vi.fn()
      const options: UseElementHoverOptions = {
        delay: 500,
      }
      wrapper = mount(App, {
        props: {
          onHover,
          options,
        },
        global: {
          directives: {
            elementHover: vElementHover,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should trigger hover after 500ms', async () => {
      const element = wrapper.get('[data-test=element]')
      await element.trigger('mouseenter')
      await promiseTimeout(200)
      expect(onHover).toHaveBeenCalledTimes(0)
      await promiseTimeout(300)
      expect(onHover).toHaveBeenCalledTimes(1)
    })
  })
})
