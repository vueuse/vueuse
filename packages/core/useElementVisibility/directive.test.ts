import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vElementVisibility } from './directive'

const App = defineComponent({
  props: {
    onVisibility: {
      type: Function,
      required: true,
    },
  },

  template: `<template>
  <div v-element-visibility="onVisibility">Look me</div>
  </template>
  `,
})

describe('vElementVisibility', () => {
  let onVisibility = vi.fn()
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    onVisibility = vi.fn()
    wrapper = mount(App, {
      props: {
        onVisibility,
      },
      global: {
        directives: {
          ElementVisibility: vElementVisibility,
        },
      },
    })
  })

  it('should be defined', () => {
    expect(wrapper).toBeDefined()
  })
})
