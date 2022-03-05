import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vHover } from './directive'

const App = defineComponent({
  props: {
    onHover: {
      type: Function,
      required: true,
    },
  },

  template: `<template>
  <div v-hover="onHover">Hover me</div>
  </template>
  `,
})

describe('vOnLongPress', () => {
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
          hover: vHover,
        },
      },
    })
  })

  it('should be defined', () => {
    expect(wrapper).toBeDefined()
  })
})
