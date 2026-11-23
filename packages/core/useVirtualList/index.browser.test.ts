import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref as deepRef, defineComponent, nextTick } from 'vue'
import { useVirtualList } from './index'

enableAutoUnmount(afterEach)

describe.each(['vertical', 'horizontal'] as const)('useVirtualList, %s filtering', (direction) => {
  it.each([3, 20])('renders results after filtering a scrolled list to %i items', async (length) => {
    const source = deepRef(Array.from({ length: 100 }, (_, index) => index))
    const scrollKey = direction === 'vertical' ? 'scrollTop' : 'scrollLeft'
    const scrollSizeKey = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth'
    const wrapper = mount(defineComponent({
      template: `
        <div v-bind="containerProps" style="width: 100px; height: 100px;">
          <div v-bind="wrapperProps">
            <div
              v-for="item in list"
              :key="item.index"
              data-row
              style="width: 20px; height: 20px; flex-shrink: 0;"
            >{{ item.data }}</div>
          </div>
        </div>
      `,
      setup() {
        return useVirtualList(source, direction === 'vertical' ? { itemHeight: 20 } : { itemWidth: 20 })
      },
    }), { attachTo: document.body })
    const container = wrapper.element as HTMLElement
    await vi.waitFor(() => expect(container[scrollSizeKey]).toBe(2000))

    container[scrollKey] = 1800
    container.dispatchEvent(new Event('scroll'))
    await nextTick()

    source.value = Array.from({ length }, (_, index) => index + 100)
    await nextTick()

    expect(container[scrollKey]).toBe(Math.max(0, length * 20 - 100))
    const rows = wrapper.findAll('[data-row]')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.at(-1)!.text()).toBe(String(99 + length))
    const lastRowBounds = rows.at(-1)!.element.getBoundingClientRect()
    const containerBounds = container.getBoundingClientRect()
    if (direction === 'vertical') {
      expect(lastRowBounds.bottom).toBeLessThanOrEqual(containerBounds.bottom)
      expect(lastRowBounds.bottom).toBeGreaterThan(containerBounds.top)
    }
    else {
      expect(lastRowBounds.right).toBeLessThanOrEqual(containerBounds.right)
      expect(lastRowBounds.right).toBeGreaterThan(containerBounds.left)
    }
  })
})
