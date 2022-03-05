import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { vMagicKeys } from './directive'
import type { UseMagicKeysOptions } from '.'

const App = defineComponent({
  props: {
    onUpdate: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-magic-keys="[onUpdate, options]">Hello world!</div>
  <div v-else v-magic-keys="onUpdate">Hello world!</div>
  </template>
  `,
})

describe('vMagicKeys', () => {
  let onUpdate = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onUpdate = vi.fn()
      wrapper = mount(App, {
        props: {
          onUpdate,
        },
        global: {
          directives: {
            'magic-keys': vMagicKeys,
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
      onUpdate = vi.fn()
      const options: UseMagicKeysOptions<false> = {
        passive: false,
      }
      wrapper = mount(App, {
        props: {
          onUpdate,
          options,
        },
        global: {
          directives: {
            'magic-keys': vMagicKeys,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
