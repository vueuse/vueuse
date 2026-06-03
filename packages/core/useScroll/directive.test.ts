import type { VueWrapper } from '@vue/test-utils'
import type { UseScrollOptions } from './index'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vScroll } from './directive'

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

const mockScrollEvent = new Event('scroll')

describe('vScroll', () => {
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
            scroll: vScroll,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')
      wrapper.unmount()
      if (element) {
        element.dispatchEvent(mockScrollEvent)
        await nextTick()
        expect(onScroll).toBeCalledTimes(0)
      }
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onScroll = vi.fn()
      const options: UseScrollOptions = {
        throttle: 10,
      }
      wrapper = mount(App, {
        props: {
          onScroll,
          options,
        },
        global: {
          directives: {
            scroll: vScroll,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should clear directive when component is unmounted', async () => {
      const element = wrapper.element.querySelector('div')
      wrapper.unmount()
      if (element) {
        element.dispatchEvent(mockScrollEvent)
        await nextTick()
        expect(onScroll).toBeCalledTimes(0)
      }
    })
  })
})
