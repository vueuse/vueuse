import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vElementHover } from './directive'

const App = defineComponent({
  props: {
    onHover: {
      type: Function,
      required: true,
    },
  },

  template: `<template>
  <div v-element-hover="onHover">Hover me</div>
  </template>
  `,
})

const mockMouseEnterEvent = new MouseEvent('mouseenter', {
  clientX: 10,
  clientY: 10,
})

describe('vElementHover', () => {
  let onHover = vi.fn()
  let wrapper: VueWrapper<any>

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

  it('should clear directive when component is unmounted', async () => {
    const element = wrapper.element.querySelector('div')
    wrapper.unmount()
    if (element) {
      element.dispatchEvent(mockMouseEnterEvent)
      await nextTick()
      expect(onHover).toBeCalledTimes(0)
    }
  })
})
