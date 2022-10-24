import { defineComponent, nextTick } from 'vue-demi'

import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { Visible } from './component'

const App = defineComponent({
  components: { Visible },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  template: `<template>
  <Visible data-test="element" :show="visible">Hello World</Visible>
  </template>
  `,
})

const createWrapper = (visible: boolean) => {
  return mount(App, {
    props: {
      visible,
    },
  })
}

describe('vVisible', () => {
  let wrapper: VueWrapper<any>

  it('export module', () => {
    expect(Visible).toBeDefined()
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
    it('should set visibility', async () => {
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
    it('should set visibility', async () => {
      const element = wrapper.get<HTMLElement>('[data-test=element]')
      expect(element.element.style.visibility).toEqual('hidden')
      await wrapper.setProps({ visible: true })
      await nextTick()
      expect(element.element.style.visibility).toEqual('visible')
    })
  })
})
