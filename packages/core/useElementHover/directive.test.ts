import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

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
})
