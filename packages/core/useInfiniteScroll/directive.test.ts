import { defineComponent } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { VInfiniteScroll } from './directive'
// import type { UseInfiniteScrollOptions } from '.'

const mockScrollEventInit = (): Partial<any> => ({
  clientHeight: 100,
  scrollTop: 50,
  scrollHeight: 50,
})

const mockScrollEvent = () => new CustomEvent('scroll', mockScrollEventInit(),
)

const App = defineComponent({
  props: {
    onInfiniteScroll: {
      type: Function,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  template: `<template>
  <div data-test="element" v-if="options" v-infinite-scroll="{handler: onInfiniteScroll, options}">Press me</div>
  <div class="message" data-test="element" v-else v-infinite-scroll="onInfiniteScroll" style="width:100px;height:100px;overflow:scroll;"><p style="width:100px;height:5000px">scroll Item</p></div>
  </template>
  `,
})

describe('vInfiniteScroll', () => {
  let onInfiniteScroll = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onInfiniteScroll = vi.fn()
      wrapper = mount(App, {
        props: {
          onInfiniteScroll,
        },
        global: {
          directives: {
            'infinite-scroll': VInfiniteScroll,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })

    it('should trigger callback', async() => {
      const element = wrapper.get('[data-test=element]')
      element.element.dispatchEvent(mockScrollEvent())
      expect(onInfiniteScroll).toHaveBeenCalledTimes(1)
    })
  })

  // describe('given options', () => {
  //   beforeEach(() => {
  //     onInfiniteScroll = vi.fn()
  //     const options: UseInfiniteScrollOptions = {
  //       distance: 10,
  //     }
  //     wrapper = mount(App, {
  //       props: {
  //         onInfiniteScroll,
  //         options,
  //       },
  //       global: {
  //         directives: {
  //           'infinite-scroll': VInfiniteScroll,
  //         },
  //       },
  //     })
  //   })

  //   it('should be defined', () => {
  //     expect(wrapper).toBeDefined()
  //   })

  //   it('should trigger longpress after 500ms', async() => {
  //     const element = wrapper.get('[data-test=element]')
  //     await element.trigger('pointerdown')
  //     await promiseTimeout(500)
  //     expect(onInfiniteScroll).toHaveBeenCalledTimes(0)
  //     await promiseTimeout(500)
  //     expect(onInfiniteScroll).toHaveBeenCalledTimes(1)
  //   })
  // })
})
