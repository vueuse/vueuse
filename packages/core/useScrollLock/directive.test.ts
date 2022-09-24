import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vScrollLock } from './directive'

const App = defineComponent({
  props: {
    isLocked: {
      type: Boolean,
      required: true,
    },
  },

  template: `<template>
  <div v-scroll-lock="isLocked">Scroll Area</div>
  </template>
  `,
})

describe('vScrollLock', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(App, {
      props: {
        isLocked: true,
      },
      global: {
        directives: {
          scrollLock: vScrollLock,
        },
      },
    })
  })

  it('should be defined', () => {
    expect(wrapper).toBeDefined()
  })
})
