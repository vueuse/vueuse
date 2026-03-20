import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { vElementSize } from './directive'
import { useElementSize } from './index.ts' // 👈 补上

// 👇 必须加：mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

const App = defineComponent({
  props: {
    onResize: {
      type: Function,
      required: true,
    },
    options: {
      type: Array,
      required: false,
    },
  },

  template: `<template>
  <div v-if="options" v-element-size="[onResize,options]">Hello world!</div>
  <div v-else v-element-size="onResize">Hello world!</div>
  </template>
  `,
})

describe('vElementSize', () => {
  let onResize = vi.fn()
  let wrapper: VueWrapper<any>

  describe('given no options', () => {
    beforeEach(() => {
      onResize = vi.fn()
      wrapper = mount(App, {
        props: {
          onResize,
        },
        global: {
          directives: {
            ElementSize: vElementSize,
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
      onResize = vi.fn()
      const options = [{ width: 100, height: 100 }, { box: 'content-box' }]

      wrapper = mount(App, {
        props: {
          onResize,
          options,
        },
        global: {
          directives: {
            ElementSize: vElementSize,
          },
        },
      })
    })

    it('should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})

describe('useElementSize - svg branch (component)', () => {
  it('should use clientWidth/clientHeight when target is SVG', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    Object.defineProperty(svg, 'clientWidth', {
      value: 123,
      configurable: true,
    })
    Object.defineProperty(svg, 'clientHeight', {
      value: 456,
      configurable: true,
    })

    const Comp = defineComponent({
      setup() {
        const el = shallowRef<SVGElement | null>(null)
        const { width, height } = useElementSize(el)

        return { el, width, height }
      },
      template: `<svg ref="el"></svg>`,
    })

    const wrapper = mount(Comp)

    wrapper.vm.el = svg

    await nextTick()

    expect(wrapper.vm.width).toBe(123)
    expect(wrapper.vm.height).toBe(456)
  })
})
