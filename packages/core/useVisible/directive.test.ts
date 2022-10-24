import { defineComponent, isVue3, nextTick } from 'vue-demi'

import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vVisible } from './directive'

const App = defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  template: `<template>
  <div data-test="element" v-visible="visible">Hello World</div>
  </template>
  `,
})

const createWrapper = (visible: boolean) => {
  return mount(App, {
    props: {
      visible,
    },
    global: {
      directives: {
        visible: vVisible,
      },
    },
  })
}

describe('vVisible', () => {
  let wrapper: VueWrapper<any>

  it('export module', () => {
    expect(vVisible).toBeDefined()
  })

  describe('wrapper', () => {
    beforeEach(() => {
      wrapper = createWrapper(true)
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })

  describe('given initial value is true', () => {
    beforeEach(() => {
      wrapper = createWrapper(true)
    })
    it.runIf(isVue3)('should set visibility', async () => {
      const element = wrapper.get<HTMLElement>('[data-test=element]')
      expect(element.element.style.visibility).toEqual('visible')
      await wrapper.setProps({ visible: false })
      await nextTick()
      expect(element.element.style.visibility).toEqual('hidden')
    })
  })

  describe('given initial value is false', () => {
    beforeEach(() => {
      wrapper = createWrapper(false)
    })
    it.runIf(isVue3)('should set visibility', async () => {
      const element = wrapper.get<HTMLElement>('[data-test=element]')
      expect(element.element.style.visibility).toEqual('hidden')
      await wrapper.setProps({ visible: true })
      await nextTick()
      expect(element.element.style.visibility).toEqual('visible')
    })
  })
})
