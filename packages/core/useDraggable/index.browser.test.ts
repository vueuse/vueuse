import { mount } from '@vue/test-utils'
import { useDraggable } from '@vueuse/core'
import { baseMousePointerEventOptions } from '@vueuse/core/useDraggable/index.test'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'

describe('useDraggable', () => {
  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function getMove(
    axis: 'x' | 'y',
    containerRect: DOMRect,
    el: HTMLElement,
    margin: number,
    offset: number,
  ) {
    if (axis === 'x') {
      const scrollTriggerX = containerRect.right - margin
      const leftEdge = scrollTriggerX - el.offsetWidth
      return leftEdge + offset
    }
    else {
      const scrollTriggerY = containerRect.bottom - margin
      const topEdge = scrollTriggerY - el.offsetHeight
      return topEdge + offset
    }
  }

  function mountDraggableAutoScroll({
    initialValue = { x: 100, y: 100 },
    autoScroll = { margin: 30, speed: 2 },
  } = {}) {
    const template = `
      <div ref="container" class="scroll-container" style="width: 300px; height: 200px; overflow: auto; border: 1px solid black; box-sizing: border-box;">
        <div style="width: 1000px; height: 1000px; position: relative;">
          <div ref="el"style="width: 100px; height: 100px; position: absolute; top: 100px; left: 100px; background: darkslategray;" />
        </div>
      </div>
    `
    return mount(defineComponent({
      template,
      setup() {
        const el = shallowRef<HTMLElement | null>(null)
        const container = shallowRef<HTMLElement | null>(null)
        useDraggable(el, {
          initialValue,
          autoScroll,
          containerElement: container,
        })
        return { el, container }
      },
    }), { attachTo: document.body })
  }

  async function setupAutoScrollTest() {
    const wrapper = mountDraggableAutoScroll()
    return (async () => {
      await nextTick()
      const el = wrapper.vm.el!
      const container = wrapper.vm.container!
      const elRect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      return { wrapper, el, container, elRect, containerRect }
    })()
  }

  async function simulateAutoScrollDrag({
    el,
    container,
    pointerdown,
    pointermove,
    duration = 1000,
    interval = 60,
  }: {
    el: HTMLElement
    container: HTMLElement
    pointerdown: { x: number, y: number }
    pointermove: { x: number, y: number }
    duration?: number
    interval?: number
  }) {
    container.scrollLeft = 0
    container.scrollTop = 0

    el.dispatchEvent(new PointerEvent('pointerdown', {
      ...baseMousePointerEventOptions,
      clientX: pointerdown.x,
      clientY: pointerdown.y,
    }))

    const startTime = Date.now()
    while (Date.now() - startTime < duration) {
      document.dispatchEvent(new PointerEvent('pointermove', {
        ...baseMousePointerEventOptions,
        clientX: pointermove.x,
        clientY: pointermove.y,
      }))
      await wait(interval)
    }
  }

  describe('autoScroll', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should auto-scroll horizontally when dragging near right edge', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const margin = 30

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: getMove('x', containerRect, el, margin, dragOffset), y: 0 },
      })

      expect(container.scrollTop).toBe(0)
      expect(container.scrollLeft).toBeGreaterThanOrEqual(120)
      expect(container.scrollLeft).toBeLessThanOrEqual(135)

      document.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
      wrapper.unmount()
    })

    it('should auto-scroll vertically when dragging near bottom edge', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const margin = 30

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: 0, y: getMove('y', containerRect, el, margin, dragOffset) },
      })

      expect(container.scrollLeft).toBe(0)
      expect(container.scrollTop).toBeGreaterThanOrEqual(120)
      expect(container.scrollTop).toBeLessThanOrEqual(135)

      document.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
      wrapper.unmount()
    })

    it('should NOT auto-scroll when dragging outside the margin', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const margin = 30
      const marginOffset = 2

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: {
          x: getMove('x', containerRect, el, margin, dragOffset - marginOffset),
          y: getMove('y', containerRect, el, margin, dragOffset - marginOffset),
        },
      })

      expect(container.scrollLeft).toBe(0)
      expect(container.scrollTop).toBe(0)

      document.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
      wrapper.unmount()
    })

    it('should auto-scroll both axes when dragging in the bottom-right corner', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const margin = 30
      const moveX = getMove('x', containerRect, el, margin, dragOffset)
      const moveY = getMove('y', containerRect, el, margin, dragOffset)

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: moveX, y: moveY },
      })

      await nextTick()

      expect(container.scrollLeft).toBeGreaterThanOrEqual(120)
      expect(container.scrollLeft).toBeLessThanOrEqual(135)
      expect(container.scrollTop).toBeGreaterThanOrEqual(120)
      expect(container.scrollTop).toBeLessThanOrEqual(135)

      document.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
      wrapper.unmount()
    })
  })
})
