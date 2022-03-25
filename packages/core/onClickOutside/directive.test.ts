import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vOnClickOutside } from './directive'

const App = defineComponent({
  props: {
    handler: {
      type: Function,
      required: true,
    },
  },

  template: `<template>
  <div v-on-click-outside="handler">Hello world!</div>
  </template>
  `,
})

describe('vOnClickOutside', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(App, {
      props: {
        handler: () => {},
      },
      global: {
        directives: {
          onClickOutside: vOnClickOutside,
        },
      },
    })
  })

  it('should be defined', () => {
    expect(wrapper).toBeDefined()
  })
})
