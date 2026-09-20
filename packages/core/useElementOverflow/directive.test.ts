import type { VueWrapper } from '@vue/test-utils'
import type { UseElementOverflowOptions } from './index'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vElementOverflow } from './directive'

const App = defineComponent({
  props: {
    onOverflow: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-element-overflow="[onOverflow, options]">Hello world!</div>
  <div v-else v-element-overflow="onOverflow">Hello world!</div>
  </template>
  `,
})

describe('vElementOverflow', () => {
  let onOverflow = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onOverflow = vi.fn()
      wrapper = mount(App, {
        props: {
          onOverflow,
        },
        global: {
          directives: {
            ElementOverflow: vElementOverflow,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
      expect(onOverflow).toHaveBeenCalledOnce()
    })

    it('should call handler when overflow state changes', async () => {
      const element = wrapper.get('div').element
      changeDomSize(element, 'offsetWidth', 10)
      changeDomSize(element, 'scrollWidth', 50)

      const info = onOverflow.mock.calls[0][0]
      info.update()
      await nextTick()

      expect(onOverflow).toHaveBeenCalledTimes(2)
      expect(onOverflow.mock.calls[1][0].isXOverflowed.value).toBe(true)
    })
  })

  describe('given options', () => {
    beforeEach(() => {
      onOverflow = vi.fn()
      const options: UseElementOverflowOptions = {
        observeMutation: {
          attributes: true,
        },
      }

      wrapper = mount(App, {
        props: {
          onOverflow,
          options,
        },
        global: {
          directives: {
            ElementOverflow: vElementOverflow,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
      expect(onOverflow).toHaveBeenCalledOnce()
    })
  })
})

function changeDomSize(el: Element, property: 'offsetWidth' | 'scrollWidth', value: number) {
  Object.defineProperty(el, property, {
    value,
    writable: true,
  })
}
