import { mount } from '@vue/test-utils'
import { useDraggable } from '@vueuse/core'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, useTemplateRef } from 'vue'
import { baseMousePointerEventOptions } from '../useDraggable/index.test'

interface DraggableAutoScrollOptions {
  initialValue?: { x: number, y: number }
  autoScroll?: { margin: number, speed: number }
}

const defaultDraggableOptions: Required<DraggableAutoScrollOptions> = {
  initialValue: { x: 100, y: 100 },
  autoScroll: { margin: 30, speed: 2 },
}

function withDraggableDefaults(opts: DraggableAutoScrollOptions = {}): Required<DraggableAutoScrollOptions> {
  return {
    initialValue: opts.initialValue ?? defaultDraggableOptions.initialValue,
    autoScroll: opts.autoScroll ?? defaultDraggableOptions.autoScroll,
  }
}

describe('useDraggable', () => {
  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const isChromium = () => typeof navigator !== 'undefined' && navigator.userAgent.includes('Chrome')

  function getMove({
    axis = 'x',
    containerRect,
    el,
    margin = defaultDraggableOptions.autoScroll.margin,
    offset,
  }: {
    axis?: 'x' | 'y'
    containerRect: DOMRect
    el: HTMLElement
    margin?: number
    offset: number
  }) {
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

  function mountDraggableAutoScroll(opts: DraggableAutoScrollOptions = {}) {
    const { initialValue, autoScroll } = withDraggableDefaults(opts)
    const template = `
      <div ref="container" class="scroll-container" style="width: 300px; height: 200px; overflow: auto; border: 1px solid black; box-sizing: border-box; scrollbar-width: none; -ms-overflow-style: none;">
        <div style="width: 1000px; height: 1000px; position: relative;">
          <div ref="el" style="width: 100px; height: 100px; position: absolute; top: 100px; left: 100px; background: darkslategray;" />
        </div>
      </div>
    `
    return mount(defineComponent({
      template,
      setup() {
        const el = useTemplateRef<HTMLElement>('el')
        const container = useTemplateRef<HTMLElement>('container')
        useDraggable(el, {
          initialValue,
          autoScroll,
          containerElement: container,
        })
        return { el, container }
      },
    }), { attachTo: document.body })
  }

  function dispatchPointerUp() {
    document.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
  }

  async function setupAutoScrollTest(opts: DraggableAutoScrollOptions = {}) {
    const wrapper = mountDraggableAutoScroll(opts)
    await nextTick()
    const el = wrapper.vm.el!
    const container = wrapper.vm.container!
    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    return { wrapper, el, container, elRect, containerRect }
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

    it.runIf(isChromium())('should auto-scroll horizontally when dragging near right edge', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect, el, offset: dragOffset }), y: 0 },
      })

      expect(container.scrollTop).toBe(0)
      expect(container.scrollLeft).toBe(130)

      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should auto-scroll vertically when dragging near bottom edge', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: 0, y: getMove({ axis: 'y', containerRect, el, offset: dragOffset }) },
      })

      expect(container.scrollLeft).toBe(0)
      expect(container.scrollTop).toBe(130)

      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should NOT auto-scroll when dragging outside the margin', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const marginOffset = 2

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: {
          x: getMove({ axis: 'x', containerRect, el, offset: dragOffset - marginOffset }),
          y: getMove({ axis: 'y', containerRect, el, offset: dragOffset - marginOffset }),
        },
      })

      expect(container.scrollLeft).toBe(0)
      expect(container.scrollTop).toBe(0)

      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should auto-scroll both axes when dragging in the bottom-right corner', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest()
      const dragOffset = 10
      const moveX = getMove({ axis: 'x', containerRect, el, offset: dragOffset })
      const moveY = getMove({ axis: 'y', containerRect, el, offset: dragOffset })

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: moveX, y: moveY },
      })

      await nextTick()

      expect(container.scrollLeft).toBe(130)
      expect(container.scrollTop).toBe(130)

      dispatchPointerUp()
      wrapper.unmount()
    })
  })
})
