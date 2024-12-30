import type { VueWrapper } from '@vue/test-utils'
import type { UseIntersectionObserverOptions } from '.'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vIntersectionObserver } from './directive'

const App = defineComponent({
  props: {
    onIntersectionObserver: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-intersection-observer="[onIntersectionObserver,options]">Hello world!</div>
  <div v-else v-intersection-observer="onIntersectionObserver">Hello world!</div>
  </template>
  `,
})

describe('vIntersectionObserver', () => {
  let onIntersectionObserver = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onIntersectionObserver = vi.fn()
      wrapper = mount(App, {
        props: {
          onIntersectionObserver,
        },
        global: {
          directives: {
            'intersection-observer': vIntersectionObserver,
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
      onIntersectionObserver = vi.fn()
      const options: UseIntersectionObserverOptions = {
        rootMargin: '10px',
      }
      wrapper = mount(App, {
        props: {
          onIntersectionObserver,
          options,
        },
        global: {
          directives: {
            'intersection-observer': vIntersectionObserver,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
