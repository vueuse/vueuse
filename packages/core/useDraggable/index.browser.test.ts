import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { SnapBoundingRect, UseDraggableOptions } from './index'
import { mount } from '@vue/test-utils'
import { useDraggable } from '@vueuse/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, shallowRef, useTemplateRef } from 'vue'
import { UseDraggable } from './component'

interface DraggableAutoScrollOptions {
  initialValue?: { x: number, y: number }
  autoScroll?: {
    margin?: number | { x: number, y: number }
    speed?: number | number[] | { x: number, y: number }
    sensitivity?: number | number[]
    direction?: 'x' | 'y' | 'both'
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }
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

interface DraggableComponentOptions {
  template?: string
  useDraggableOptions?: UseDraggableOptions
  setupFn?: (useDraggableOptions: UseDraggableOptions) => Record<string, any>
}

function createDraggableComponent({
  template = `<div ref="el" />`,
  useDraggableOptions = {},
  setupFn,
}: DraggableComponentOptions = {}): VueWrapper<ComponentPublicInstance> {
  return mount(defineComponent({
    template,
    setup() {
      if (setupFn) {
        return setupFn(useDraggableOptions)
      }

      const el = useTemplateRef<HTMLElement>('el')

      const draggable = useDraggable(el, {
        preventDefault: true,
        ...useDraggableOptions,
      })

      return { el, ...draggable }
    },
  }), {
    attachTo: document.body,
  })
}

interface SimulateDragOptions {
  start?: { x: number, y: number }
  move?: { x: number, y: number }
  initialValue?: { x: number, y: number }
  checkIsDragging?: boolean
}

const baseMousePointerEventOptions = {
  bubbles: true,
  cancelable: true,
  pointerType: 'mouse',
}

async function simulateDrag(
  wrapper: VueWrapper<any>,
  options: SimulateDragOptions,
): Promise<void> {
  const {
    start = { x: 0, y: 0 },
    move = { x: 50, y: 30 },
    checkIsDragging = true,
  } = options

  await nextTick()

  const el = wrapper.vm.el

  const pointerDownEvent = new PointerEvent('pointerdown', {
    clientX: start.x,
    clientY: start.y,
    ...baseMousePointerEventOptions,
  })
  el?.dispatchEvent(pointerDownEvent)
  await nextTick()

  if (checkIsDragging)
    expect(wrapper.vm.isDragging).toBe(true)

  const pointerMoveEvent = new PointerEvent('pointermove', {
    clientX: move.x,
    clientY: move.y,
    ...baseMousePointerEventOptions,
  })
  document.dispatchEvent(pointerMoveEvent)
  await nextTick()
}

async function endDrag(wrapper: VueWrapper<any>): Promise<void> {
  const pointerUpEvent = new PointerEvent('pointerup', baseMousePointerEventOptions)
  document.dispatchEvent(pointerUpEvent)
  await nextTick()

  expect(wrapper.vm.isDragging).toBe(false)

  wrapper.unmount()
}

interface DragSnapOptions {
  /** Snap configuration passed straight to `useDraggable`. */
  snap: UseDraggableOptions['snap']
  /** Rendered size of the draggable element (drives snap corner/edge/center math). */
  size?: { width: number, height: number }
  /** Position the pointer is dragged to (becomes the element position before snapping). */
  to: { x: number, y: number }
  /**
   * When set, the element is rendered inside a fixed `base`×`base` container so the
   * snap base size (used to resolve percentage targets) is deterministic.
   */
  base?: number
}

/**
 * Mounts a real draggable element, performs a drag to `to`, and returns the
 * resulting committed position + snapped flag. The element is pinned to the
 * viewport origin so the dragged pointer coordinate maps 1:1 to the element
 * position, letting us assert snapping behavior end-to-end instead of calling
 * the internal math directly.
 */
async function dragSnap({ snap, size = { width: 0, height: 0 }, to, base }: DragSnapOptions): Promise<{ x: number, y: number, snapped: boolean }> {
  const useContainer = base != null
  const wrapper = mount(defineComponent({
    setup() {
      const el = useTemplateRef<HTMLElement>('el')
      const container = useTemplateRef<HTMLElement>('container')
      const drag = useDraggable(el, {
        snap,
        ...(useContainer ? { containerElement: container } : {}),
      })
      return { el, container, ...drag }
    },
    render() {
      const elNode = h('div', {
        ref: 'el',
        style: `position: ${useContainer ? 'absolute' : 'fixed'}; left: 0; top: 0; width: ${size.width}px; height: ${size.height}px;`,
      })
      if (!useContainer)
        return elNode
      return h('div', {
        ref: 'container',
        style: `position: fixed; left: 0; top: 0; width: ${base}px; height: ${base}px; overflow: hidden; box-sizing: border-box;`,
      }, [elNode])
    },
  }), { attachTo: document.body })

  await nextTick()
  const el = (wrapper.vm as any).el as HTMLElement
  el.dispatchEvent(new PointerEvent('pointerdown', { ...baseMousePointerEventOptions, clientX: 0, clientY: 0 }))
  await nextTick()
  window.dispatchEvent(new PointerEvent('pointermove', { ...baseMousePointerEventOptions, clientX: to.x, clientY: to.y }))
  await nextTick()

  const result = {
    x: (wrapper.vm as any).x as number,
    y: (wrapper.vm as any).y as number,
    snapped: (wrapper.vm as any).snapped as boolean,
  }

  window.dispatchEvent(new PointerEvent('pointerup', baseMousePointerEventOptions))
  wrapper.unmount()
  return result
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
    margin?: number | { x: number, y: number }
    offset: number
  }) {
    if (axis === 'x') {
      const marginVal = typeof margin === 'number' ? margin : (margin?.x ?? 0)
      const scrollTriggerX = containerRect.right - marginVal
      const leftEdge = scrollTriggerX - el.offsetWidth
      return leftEdge + offset
    }
    else {
      const marginVal = typeof margin === 'number' ? margin : (margin?.y ?? 0)
      const scrollTriggerY = containerRect.bottom - marginVal
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
    duration = 300,
    interval = 1000 / 60,
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

  describe('core functionality', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should be defined', () => {
      expect(useDraggable).toBeDefined()
    })

    it('should have default values', () => {
      const el = shallowRef<HTMLElement>()
      const { x, y, style, isDragging } = useDraggable(el)

      expect(x.value).toBe(0)
      expect(y.value).toBe(0)
      expect(isDragging.value).toBe(false)
      expect(style.value).toContain('left: 0px')
      expect(style.value).toContain('top: 0px')
    })

    it('should respect initial values', () => {
      const el = shallowRef<HTMLElement>()
      const { x, y, style } = useDraggable(el, { initialValue: { x: 100, y: 200 } })

      expect(x.value).toBe(100)
      expect(y.value).toBe(200)
      expect(style.value).toContain('left: 100px')
      expect(style.value).toContain('top: 200px')
    })

    it('should update position when x/y changed', async () => {
      const el = shallowRef<HTMLElement>()
      const { x, y, style } = useDraggable(el)

      x.value = 50
      y.value = 75

      await nextTick()

      expect(style.value).toContain('left: 50px')
      expect(style.value).toContain('top: 75px')
    })

    it('should handle component integration', () => {
      const wrapper = mount(defineComponent({
        template: '<div ref="el" />',
        setup() {
          const el = shallowRef<HTMLElement>()
          const draggable = useDraggable(el)

          return { el, ...draggable }
        },
      }))

      const vm = wrapper.vm

      expect(vm.x).toBe(0)
      expect(vm.y).toBe(0)
      expect(vm.isDragging).toBe(false)

      wrapper.unmount()
    })
  })

  describe('drag behavior', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should support dragging behavior to the correct position', async () => {
      const initialValue = { x: 50, y: 50 }

      const wrapper = createDraggableComponent({
        useDraggableOptions: {
          initialValue,
        },
      })

      await simulateDrag(wrapper, {
        move: { x: 50, y: 30 },
      })

      expect(wrapper.vm).toMatchObject({
        x: 50,
        y: 30,
      })

      await endDrag(wrapper)
    })

    it('should respect axis constraints during drag operations', async () => {
      const initialValue = { x: 50, y: 50 }

      const wrapper = createDraggableComponent({
        useDraggableOptions: { initialValue, axis: 'y' },
      })

      await simulateDrag(wrapper, {
        move: { x: 50, y: 30 },
      })

      expect(wrapper.vm).toMatchObject({
        x: initialValue.x,
        y: 30,
      })

      await endDrag(wrapper)
    })

    it('should respect axis:x constraints during drag operations', async () => {
      const initialValue = { x: 50, y: 50 }

      const wrapper = createDraggableComponent({
        useDraggableOptions: { initialValue, axis: 'x' },
      })

      await simulateDrag(wrapper, {
        move: { x: 70, y: 30 },
      })

      expect(wrapper.vm).toMatchObject({
        x: 70,
        y: initialValue.y,
      })

      await endDrag(wrapper)
    })

    it('should disabled dragging behaviour', async () => {
      const initialValue = { x: 50, y: 50 }

      const wrapper = createDraggableComponent({
        useDraggableOptions: {
          initialValue,
          disabled: true,
        },
      })

      await simulateDrag(wrapper, {
        move: { x: 50, y: 30 },
        checkIsDragging: false,
      })

      expect(wrapper.vm).toMatchObject({
        x: initialValue.x,
        y: initialValue.y,
      })

      await endDrag(wrapper)
    })
  })

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
      expect(container.scrollLeft).toBeGreaterThan(0)

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
      expect(container.scrollTop).toBeGreaterThan(0)

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

      expect(container.scrollLeft).toBeGreaterThan(0)
      expect(container.scrollTop).toBeGreaterThan(0)

      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should respect custom scroll speed configuration', async () => {
      const customSpeed = 5
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest({
        autoScroll: { margin: 30, speed: customSpeed },
      })
      const dragOffset = 10

      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect, el, offset: dragOffset }), y: 0 },
        duration: 500,
      })

      expect(container.scrollLeft).toBeGreaterThan(50)

      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should scroll faster in the inner sensitivity tier than the outer tier', async () => {
      const autoScroll = { margin: 80, speed: [2, 30], sensitivity: [80, 20] }
      const dragOffset = 10

      // outer tier: element edge sits within the outer threshold only → slow speed
      const outer = await setupAutoScrollTest({ autoScroll })
      await simulateAutoScrollDrag({
        el: outer.el,
        container: outer.container,
        pointerdown: { x: outer.elRect.left + dragOffset, y: outer.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: outer.containerRect, el: outer.el, margin: 80, offset: dragOffset }), y: 0 },
        duration: 300,
      })
      const outerScroll = outer.container.scrollLeft
      dispatchPointerUp()
      outer.wrapper.unmount()

      // inner tier: element dragged deep into the edge → fast speed
      const inner = await setupAutoScrollTest({ autoScroll })
      await simulateAutoScrollDrag({
        el: inner.el,
        container: inner.container,
        pointerdown: { x: inner.elRect.left + dragOffset, y: inner.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: inner.containerRect, el: inner.el, margin: 80, offset: dragOffset + 70 }), y: 0 },
        duration: 300,
      })
      const innerScroll = inner.container.scrollLeft
      dispatchPointerUp()
      inner.wrapper.unmount()

      expect(innerScroll).toBeGreaterThan(outerScroll)
    })

    it.runIf(isChromium())('should clamp auto-scroll to the maxX bound', async () => {
      const dragOffset = 10
      const maxX = 40

      // control: without a bound it scrolls well past maxX
      const control = await setupAutoScrollTest({ autoScroll: { margin: 30, speed: 10 } })
      await simulateAutoScrollDrag({
        el: control.el,
        container: control.container,
        pointerdown: { x: control.elRect.left + dragOffset, y: control.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: control.containerRect, el: control.el, offset: dragOffset }), y: 0 },
        duration: 400,
      })
      expect(control.container.scrollLeft).toBeGreaterThan(maxX)
      dispatchPointerUp()
      control.wrapper.unmount()

      // bounded: scrollLeft never exceeds maxX
      const bounded = await setupAutoScrollTest({ autoScroll: { margin: 30, speed: 10, maxX } })
      await simulateAutoScrollDrag({
        el: bounded.el,
        container: bounded.container,
        pointerdown: { x: bounded.elRect.left + dragOffset, y: bounded.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: bounded.containerRect, el: bounded.el, offset: dragOffset }), y: 0 },
        duration: 400,
      })
      expect(bounded.container.scrollLeft).toBeLessThanOrEqual(maxX)
      expect(bounded.container.scrollLeft).toBeGreaterThan(0)
      dispatchPointerUp()
      bounded.wrapper.unmount()
    })

    it.runIf(isChromium())('should only auto-scroll the x axis when direction is x', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest({
        autoScroll: { margin: 30, speed: 6, direction: 'x' },
      })
      const dragOffset = 10
      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: {
          x: getMove({ axis: 'x', containerRect, el, offset: dragOffset }),
          y: getMove({ axis: 'y', containerRect, el, offset: dragOffset }),
        },
      })
      expect(container.scrollLeft).toBeGreaterThan(0)
      expect(container.scrollTop).toBe(0)
      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should only auto-scroll the y axis when direction is y', async () => {
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest({
        autoScroll: { margin: 30, speed: 6, direction: 'y' },
      })
      const dragOffset = 10
      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: {
          x: getMove({ axis: 'x', containerRect, el, offset: dragOffset }),
          y: getMove({ axis: 'y', containerRect, el, offset: dragOffset }),
        },
      })
      expect(container.scrollTop).toBeGreaterThan(0)
      expect(container.scrollLeft).toBe(0)
      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should clamp vertical auto-scroll to the maxY bound', async () => {
      const dragOffset = 10
      const maxY = 40
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest({
        autoScroll: { margin: 30, speed: 10, maxY },
      })
      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: { x: 0, y: getMove({ axis: 'y', containerRect, el, offset: dragOffset }) },
        duration: 400,
      })
      expect(container.scrollTop).toBeLessThanOrEqual(maxY)
      expect(container.scrollTop).toBeGreaterThan(0)
      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should apply per-axis speed when speed is a Position', async () => {
      const dragOffset = 10
      const { wrapper, el, container, elRect, containerRect } = await setupAutoScrollTest({
        autoScroll: { margin: 30, speed: { x: 12, y: 2 } },
      })
      await simulateAutoScrollDrag({
        el,
        container,
        pointerdown: { x: elRect.left + dragOffset, y: elRect.top + dragOffset },
        pointermove: {
          x: getMove({ axis: 'x', containerRect, el, offset: dragOffset }),
          y: getMove({ axis: 'y', containerRect, el, offset: dragOffset }),
        },
        duration: 300,
      })
      // x speed (12) >> y speed (2) → horizontal scroll outpaces vertical
      expect(container.scrollLeft).toBeGreaterThan(container.scrollTop)
      expect(container.scrollTop).toBeGreaterThan(0)
      dispatchPointerUp()
      wrapper.unmount()
    })

    it.runIf(isChromium())('should use the last speed-array value when no sensitivity is set', async () => {
      const dragOffset = 10
      // speed array without sensitivity → falls back to the last (fastest) entry
      const fast = await setupAutoScrollTest({ autoScroll: { margin: 30, speed: [1, 12] } })
      await simulateAutoScrollDrag({
        el: fast.el,
        container: fast.container,
        pointerdown: { x: fast.elRect.left + dragOffset, y: fast.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: fast.containerRect, el: fast.el, offset: dragOffset }), y: 0 },
        duration: 300,
      })
      const fastScroll = fast.container.scrollLeft
      dispatchPointerUp()
      fast.wrapper.unmount()

      // a flat speed of 1 over the same window scrolls far less than the [1, 12] last value
      const slow = await setupAutoScrollTest({ autoScroll: { margin: 30, speed: 1 } })
      await simulateAutoScrollDrag({
        el: slow.el,
        container: slow.container,
        pointerdown: { x: slow.elRect.left + dragOffset, y: slow.elRect.top + dragOffset },
        pointermove: { x: getMove({ axis: 'x', containerRect: slow.containerRect, el: slow.el, offset: dragOffset }), y: 0 },
        duration: 300,
      })
      const slowScroll = slow.container.scrollLeft
      dispatchPointerUp()
      slow.wrapper.unmount()

      expect(fastScroll).toBeGreaterThan(slowScroll)
    })
  })

  describe('options & lifecycle', () => {
    it('basic functionality', async () => {
      const onStart = vi.fn()
      const onMove = vi.fn()
      const onEnd = vi.fn()

      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')

          const { x, y, style, isDragging } = useDraggable(el, {
            preventDefault: true,
            onMove,
            onEnd,
            onStart,
          })

          expect(x.value).toBe(0)
          expect(y.value).toBe(0)
          expect(isDragging.value).toBe(false)

          return () => h('div', {
            'data-is-dragging': isDragging.value,
            'ref': 'el',
            'style': style.value,
          })
        },
      })

      await nextTick()
      expect(wrapper.get('div').element.style.left).toBe('0px')
      expect(wrapper.get('div').element.style.top).toBe('0px')
      expect(wrapper.get('div').element.dataset.isDragging).toBe('false')
      expect(onStart).not.toBeCalled()
      expect(onMove).not.toBeCalled()
      expect(onEnd).not.toBeCalled()

      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
      }))
      await nextTick()
      expect(onStart).toHaveBeenCalledOnce()
      expect(onMove).not.toBeCalled()
      expect(onEnd).not.toBeCalled()
      expect(wrapper.get('div').element.dataset.isDragging).toBe('true')

      window.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 10,
        clientY: 20,
      }))
      await nextTick()
      expect(onMove).toHaveBeenCalledOnce()
      expect(onEnd).not.toBeCalled()
      expect(wrapper.get('div').element.style.left).toBe('10px')
      expect(wrapper.get('div').element.style.top).toBe('20px')
      expect(wrapper.get('div').element.dataset.isDragging).toBe('true')

      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(onEnd).toHaveBeenCalledOnce()
      expect(wrapper.get('div').element.style.left).toBe('10px')
      expect(wrapper.get('div').element.style.top).toBe('20px')
      expect(wrapper.get('div').element.dataset.isDragging).toBe('false')
    })

    it('component', async () => {
      const onStart = vi.fn()
      const onMove = vi.fn()
      const onEnd = vi.fn()

      const wrapper = mount({
        render: () => h(UseDraggable, { as: 'form', onStart, onMove, onEnd }, {
          default: ({ isDragging, x, y }: any) => h('div', {
            'id': 'content',
            'data-is-dragging': isDragging,
            'data-x': x,
            'data-y': y,
          }),
        }),
      })

      expect(wrapper.element.tagName).toBe('FORM')

      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('0')
      expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('false')

      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
      }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('true')
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('0')

      window.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 10,
        clientY: 20,
      }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('true')
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('10')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('20')

      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('false')
      expect(onStart).toHaveBeenCalledOnce()
      expect(onMove).toHaveBeenCalledOnce()
      expect(onEnd).toHaveBeenCalledOnce()
    })

    it('output: transform emits translate3d style', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { style } = useDraggable(el, { output: 'transform' })
          return () => h('div', { ref: 'el', style: style.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 20 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('style')).toContain('translate3d(10px, 20px, 0px)')
      expect(wrapper.get('div').element.style.left).toBe('')
      expect(wrapper.get('div').element.style.top).toBe('')
    })

    it('onMoveStart fires once per drag session', async () => {
      const onMoveStart = vi.fn()
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { onMoveStart })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10 }))
      await nextTick()
      expect(onMoveStart).toHaveBeenCalledOnce()
    })

    it('onMoveStart resets between drag sessions', async () => {
      const onMoveStart = vi.fn()
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { onMoveStart })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }))
      window.dispatchEvent(new PointerEvent('pointerup'))
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 5, clientY: 5 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10 }))
      await nextTick()
      expect(onMoveStart).toHaveBeenCalledTimes(2)
    })

    it('onBeforeMove can mutate position before commit', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            onBeforeMove: pos => ({ x: Math.round(pos.x / 20) * 20, y: pos.y }),
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 13, clientY: 7 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('20')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('7')
    })

    it('containerElement as DraggableBounds clamps below lower bounds', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            containerElement: { left: 100, top: 50, right: 500, bottom: 400 },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 20 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('100')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('50')
    })

    it('containerElement as DraggableBounds clamps above upper bounds', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            containerElement: { left: 100, top: 50, right: 500, bottom: 400 },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 600, clientY: 500 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('500')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('400')
    })

    it('containerElement as DraggableBounds allows position within bounds', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            containerElement: { left: 100, top: 50, right: 500, bottom: 400 },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 300, clientY: 200 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('300')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('200')
    })

    it('classes.draggable applied on mount', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { classes: { draggable: 'is-draggable' } })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-draggable')).toBe(true)
    })

    it('classes.dragging toggled during drag', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { classes: { dragging: 'is-dragging' } })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-dragging')).toBe(false)
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-dragging')).toBe(true)
      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-dragging')).toBe(false)
    })

    it('classes.moving added on first move and removed on drag end', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { classes: { moving: 'is-moving' } })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      expect(wrapper.get('div').element.classList.contains('is-moving')).toBe(false)
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }))
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-moving')).toBe(true)
      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(wrapper.get('div').element.classList.contains('is-moving')).toBe(false)
    })

    it('cursor.idle applied to handle element', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { cursor: { idle: 'crosshair' } })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      expect((wrapper.get('div').element as HTMLElement).style.cursor).toBe('crosshair')
    })

    it('cursor.dragging applied to document.body during drag and cleared on end', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { cursor: { dragging: 'move' } })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()
      expect(document.body.style.cursor).toBe('move')
      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(document.body.style.cursor).toBe('')
    })

    it('zIndex bumped during drag and restored on end', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          useDraggable(el, { zIndex: 999 })
          return () => h('div', { ref: 'el' })
        },
      })
      await nextTick()
      expect((wrapper.get('div').element as HTMLElement).style.zIndex).toBe('')
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()
      expect((wrapper.get('div').element as HTMLElement).style.zIndex).toBe('999')
      window.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect((wrapper.get('div').element as HTMLElement).style.zIndex).toBe('')
    })

    it('recalc() re-applies snap to current position', async () => {
      let recalcFn: (() => void) | undefined
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y, recalc } = useDraggable(el, {
            initialValue: { x: 95, y: 95 },
            snap: { x: 100, y: 100, gravity: 20 },
          })
          recalcFn = recalc
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('95')
      recalcFn!()
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('100')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('100')
    })

    it('recalc() clamps position to DraggableBounds', async () => {
      let recalcFn: (() => void) | undefined
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y, recalc } = useDraggable(el, {
            initialValue: { x: 50, y: 30 },
            containerElement: { left: 100, top: 80, right: 500, bottom: 400 },
          })
          recalcFn = recalc
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('50')
      recalcFn!()
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('100')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('80')
    })

    it('snap position target snaps to dynamic position (point)', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const otherPos = shallowRef({ x: 200, y: 200 })
          const { x, y } = useDraggable(el, {
            snap: computed(() => ({ position: otherPos.value, gravity: 30 })),
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 185 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('200')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('200')
    })

    it('snap position ref target updates dynamically', async () => {
      const otherPos = shallowRef({ x: 200, y: 200 })
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            snap: { position: otherPos, gravity: 30 },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 185 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('200')
      otherPos.value = { x: 400, y: 400 }
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 390, clientY: 385 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('400')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('400')
    })

    it('resets body cursor on unmount while still dragging', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            cursor: { dragging: 'grabbing' },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()
      expect(document.body.style.cursor).toBe('grabbing')
      wrapper.unmount()
      await nextTick()
      expect(document.body.style.cursor).toBe('')
    })

    it('onBeforeMove returning false cancels the move', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y } = useDraggable(el, {
            onBeforeMove: () => false,
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 50 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('0')
    })

    it('handle: only the handle element starts a drag', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const handle = useTemplateRef<HTMLElement>('handle')
          const { x, y } = useDraggable(el, { handle })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value }, [
            h('span', { ref: 'handle', class: 'drag-handle' }, 'handle'),
            h('span', { class: 'drag-body' }, 'body'),
          ])
        },
      })
      await nextTick()

      // pointerdown on a non-handle child must NOT start a drag
      wrapper.get('.drag-body').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 40 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')

      // pointerdown on the handle starts the drag
      wrapper.get('.drag-handle').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 40 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('40')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('40')
    })
  })

  describe('snap', () => {
    const box20 = { width: 20, height: 20 }

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('snaps to a fixed point within gravity', async () => {
      const r = await dragSnap({ snap: { x: 30, y: 30 }, to: { x: 25, y: 25 } })
      expect(r).toMatchObject({ x: 30, y: 30, snapped: true })
    })

    it('does not snap when outside default gravity', async () => {
      const r = await dragSnap({ snap: { x: 30, y: 30 }, to: { x: 5, y: 5 } })
      expect(r).toMatchObject({ x: 5, y: 5, snapped: false })
    })

    it('point target: does not snap x when y is outside gravity', async () => {
    // x dist = 5 ≤ 20, but y dist = 70 > 20 → no snap at all
      const r = await dragSnap({ snap: { x: 30, y: 30 }, to: { x: 25, y: 100 } })
      expect(r).toMatchObject({ x: 25, y: 100, snapped: false })
    })

    it('point target: does not snap y when x is outside gravity', async () => {
    // y dist = 5 ≤ 20, but x dist = 70 > 20 → no snap at all
      const r = await dragSnap({ snap: { x: 30, y: 30 }, to: { x: 100, y: 25 } })
      expect(r).toMatchObject({ x: 100, y: 25, snapped: false })
    })

    it('line target x: snaps x independently regardless of y position', async () => {
    // only x defined → line target → y is irrelevant, x snaps
      const r = await dragSnap({ snap: { x: 30 }, to: { x: 25, y: 100 } })
      expect(r.x).toBe(30)
      expect(r.snapped).toBe(true)
    })

    it('line target y: snaps y independently regardless of x position', async () => {
      const r = await dragSnap({ snap: { y: 30 }, to: { x: 100, y: 25 } })
      expect(r.y).toBe(30)
      expect(r.snapped).toBe(true)
    })

    it('snaps to a vertical line (x only, y free)', async () => {
      const r = await dragSnap({ snap: { x: 60 }, to: { x: 55, y: 200 } })
      expect(r.x).toBe(60)
      expect(r.y).toBe(200)
      expect(r.snapped).toBe(true)
    })

    it('snaps to a horizontal line (y only, x free)', async () => {
      const r = await dragSnap({ snap: { y: 60 }, to: { x: 200, y: 55 } })
      expect(r.x).toBe(200)
      expect(r.y).toBe(60)
      expect(r.snapped).toBe(true)
    })

    it('snaps with step shorthand (2D grid)', async () => {
      const r = await dragSnap({
        snap: { step: 30, x: { start: 0, end: 120 }, y: { start: 0, end: 120 } },
        to: { x: 28, y: 58 },
      })
      expect(r).toMatchObject({ x: 30, y: 60, snapped: true })
    })

    it('vertical line with y-range only snaps when y overlaps the range', async () => {
    // Line at x=60 active only for y in [0, 100]
      const snap = { x: 60, y: { start: 0, end: 100 } }

      const inRange = await dragSnap({ snap, to: { x: 55, y: 50 } })
      expect(inRange).toMatchObject({ x: 60, y: 50, snapped: true })

      const outOfRange = await dragSnap({ snap, to: { x: 55, y: 300 } })
      expect(outOfRange).toMatchObject({ x: 55, y: 300, snapped: false })
    })

    it('horizontal line with x-range only snaps when x overlaps the range', async () => {
      const snap = { y: 60, x: { start: 0, end: 100 } }

      const inRange = await dragSnap({ snap, to: { x: 50, y: 55 } })
      expect(inRange).toMatchObject({ x: 50, y: 60, snapped: true })

      const outOfRange = await dragSnap({ snap, to: { x: 300, y: 55 } })
      expect(outOfRange).toMatchObject({ x: 300, y: 55, snapped: false })
    })

    it('range-restricted line resolves percentage start/end against base size', async () => {
    // base 1000 container → x '50%' = 500, y range = [0, 50% of 1000] = [0, 500]
      const snap = { x: '50%', y: { end: '50%' } }

      const inRange = await dragSnap({ snap, to: { x: 495, y: 200 }, base: 1000 })
      expect(inRange.x).toBe(500)
      expect(inRange.snapped).toBe(true)

      const outOfRange = await dragSnap({ snap, to: { x: 495, y: 800 }, base: 1000 })
      expect(outOfRange.snapped).toBe(false)
    })

    it('respects custom gravity', async () => {
      const tooFar = await dragSnap({ snap: { x: 30, y: 30, gravity: 10 }, to: { x: 15, y: 15 } })
      expect(tooFar.snapped).toBe(false)

      const inGravity = await dragSnap({ snap: { x: 30, y: 30, gravity: 20 }, to: { x: 15, y: 15 } })
      expect(inGravity).toMatchObject({ x: 30, y: 30, snapped: true })
    })

    it('uses corner tl (default) for point targets', async () => {
      const r = await dragSnap({ snap: { x: 30, y: 30 }, size: box20, to: { x: 25, y: 25 } })
      expect(r).toMatchObject({ x: 30, y: 30 })
    })

    it('uses corner tr for point targets', async () => {
    // right edge at pos.x + width = 5 + 20 = 25, snap to 30, dist 5 ≤ 20 → x = 30 - 20 = 10
      const r = await dragSnap({ snap: { x: 30, y: 30, corner: 'tr' }, size: box20, to: { x: 5, y: 25 } })
      expect(r.x).toBe(10)
      expect(r.y).toBe(30)
    })

    it('uses corner br for point targets', async () => {
    // right edge 5+20=25 → snap 30 → x=10; bottom edge 25+20=45 → snap 30 dist15≤20 → y=10... resolves to 30 on tl axis
      const r = await dragSnap({ snap: { x: 30, y: 50, corner: 'br' }, size: box20, to: { x: 5, y: 25 } })
      expect(r.x).toBe(10)
      expect(r.y).toBe(30)
    })

    it('snaps by center', async () => {
    // center = (10+10, 10+10) = (20, 20), snap to (30, 30), dist 10 ≤ 20 → (30-10, 30-10) = (20, 20)
      const r = await dragSnap({ snap: { x: 30, y: 30, center: true }, size: box20, to: { x: 10, y: 10 } })
      expect(r).toMatchObject({ x: 20, y: 20 })
    })

    it('handles SnapOptions wrapper with shared gravity', async () => {
      const tooFar = await dragSnap({ snap: { targets: [{ x: 30, y: 30 }], gravity: 10 }, to: { x: 15, y: 15 } })
      expect(tooFar.snapped).toBe(false)

      const inGravity = await dragSnap({ snap: { targets: [{ x: 30, y: 30 }], gravity: 20 }, to: { x: 15, y: 15 } })
      expect(inGravity.snapped).toBe(true)
    })

    it('handles shorthand number input', async () => {
      const r = await dragSnap({ snap: 30, to: { x: 25, y: 25 } })
      expect(r).toMatchObject({ x: 30, y: 30, snapped: true })
    })

    it('picks the closest of multiple targets', async () => {
      const near100 = await dragSnap({ snap: [{ x: 50 }, { x: 100 }], to: { x: 95, y: 0 } })
      expect(near100.x).toBe(100)

      const near50 = await dragSnap({ snap: [{ x: 50 }, { x: 100 }], to: { x: 60, y: 0 } })
      expect(near50.x).toBe(50)
    })

    it('does not snap when all targets are outside gravity', async () => {
      const r = await dragSnap({ snap: [{ x: 100 }, { x: 200 }], to: { x: 60, y: 0 } })
      expect(r.x).toBe(60)
      expect(r.snapped).toBe(false)
    })

    it('handles percentage values', async () => {
    // base 200 container → '50%' = 100
      const r = await dragSnap({ snap: { x: '50%', y: '50%' }, to: { x: 95, y: 95 }, base: 200 })
      expect(r).toMatchObject({ x: 100, y: 100, snapped: true })
    })

    it('snaps with side start (only left/top edge probed)', async () => {
      const r = await dragSnap({ snap: { x: 30, side: 'start' }, size: box20, to: { x: 25, y: 50 } })
      expect(r.x).toBe(30)
    })

    it('snaps with side end (only right/bottom edge probed)', async () => {
    // right edge at 5+20=25, snap to 30 → x = 30 - 20 = 10
      const r = await dragSnap({ snap: { x: 30, side: 'end' }, size: box20, to: { x: 5, y: 50 } })
      expect(r.x).toBe(10)
    })

    it('returns original position with empty targets', async () => {
      const r = await dragSnap({ snap: { targets: [] }, to: { x: 25, y: 25 } })
      expect(r).toMatchObject({ x: 25, y: 25, snapped: false })
    })

    it('snaps to a SnapBoundingRect', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.x=115 → distance to left edge (100) = 15 ≤ 20 → snap x to 100
      const r = await dragSnap({ snap: { boundingBox: box }, to: { x: 115, y: 150 } })
      expect(r.x).toBe(100)
      expect(r.snapped).toBe(true)
    })

    it('snaps to the closer of two bounding rect edges', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.x=185 → distance to right (200)=15 vs left (100)=85 → snaps to 200
      const r = await dragSnap({ snap: { boundingBox: box }, to: { x: 185, y: 150 } })
      expect(r.x).toBe(200)
    })

    it('uses corner bl for point targets', async () => {
    // bl: x-offset=0 (left), y-offset=height (bottom). pos=(5,5) box20: BL at (5,25)
    // snap to (10,30): dx=5≤20, dy=5≤20 → sx=10, sy=30-20=10
      const r = await dragSnap({ snap: { x: 10, y: 30, corner: 'bl' }, size: box20, to: { x: 5, y: 5 } })
      expect(r.x).toBe(10)
      expect(r.y).toBe(10)
    })

    it('uses corner all — nearest corner wins per axis', async () => {
    // pos=(10,10) box20: BR at (30,30), snap to (35,35) dist 5≤20 → sx=15, sy=15
      const r = await dragSnap({ snap: { x: 35, y: 35, corner: 'all' }, size: box20, to: { x: 10, y: 10 } })
      expect(r.x).toBe(15)
      expect(r.y).toBe(15)
    })

    it('center overrides corner for point targets', async () => {
    // center=(20,20), snap to (30,30) dist 10≤20 → (20,20), ignores corner:'tr'
      const r = await dragSnap({ snap: { x: 30, y: 30, corner: 'tr', center: true }, size: box20, to: { x: 10, y: 10 } })
      expect(r).toMatchObject({ x: 20, y: 20 })
    })

    it('center overrides side for line targets', async () => {
    // center.x=10+10=20, line at x=30 dist 10≤20 → sx=30-10=20, ignores side:'end'
      const r = await dragSnap({ snap: { x: 30, side: 'end', center: true }, size: box20, to: { x: 10, y: 50 } })
      expect(r.x).toBe(20)
    })

    it('string shorthand percentage snaps to point', async () => {
    // base 200 → '50%' = 100 for both axes. pos=(92,92) dist 8≤20
      const r = await dragSnap({ snap: '50%', to: { x: 92, y: 92 }, base: 200 })
      expect(r).toMatchObject({ x: 100, y: 100, snapped: true })
    })

    it('per-target gravity overrides shared gravity', async () => {
    // shared gravity=5, target gravity=30 → distance ~28.3 is snapped
      const r = await dragSnap({ snap: { targets: [{ x: 30, y: 30, gravity: 30 }], gravity: 5 }, to: { x: 10, y: 10 } })
      expect(r).toMatchObject({ x: 30, y: 30, snapped: true })
    })

    it('edge inside: element left edge probes left wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // inside → left wall probe=0 → pos.x=105 dist 5≤20 → sx=100
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 105, y: 150 } })
      expect(r.x).toBe(100)
      expect(r.snapped).toBe(true)
    })

    it('edge outside: element right edge probes left wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // outside → left wall probe=width=20 → pos.x=75 probe=95 dist 5≤20 → sx=100-20=80
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'outside' }, size: box20, to: { x: 75, y: 150 } })
      expect(r.x).toBe(80)
      expect(r.snapped).toBe(true)
    })

    it('edge inside: element right edge probes right wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // inside → right wall probe=width=20 → pos.x=185 probe=205 dist 5≤20 → sx=200-20=180
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 185, y: 150 } })
      expect(r.x).toBe(180)
      expect(r.snapped).toBe(true)
    })

    it('edge inside: element bottom edge probes bottom wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // inside → bottom wall probe=height=20 → pos.y=185 probe=205 dist 5≤20 → sy=200-20=180
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 150, y: 185 } })
      expect(r.y).toBe(180)
      expect(r.snapped).toBe(true)
    })

    it('edge outside: element left edge probes right wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // outside → right wall probe=0 → pos.x=205 dist 5≤20 → sx=200
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'outside' }, size: box20, to: { x: 205, y: 150 } })
      expect(r.x).toBe(200)
      expect(r.snapped).toBe(true)
    })

    it('edge outside: element top edge probes bottom wall', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // outside → bottom wall probe=0 → pos.y=205 dist 5≤20 → sy=200
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'outside' }, size: box20, to: { x: 150, y: 205 } })
      expect(r.y).toBe(200)
      expect(r.snapped).toBe(true)
    })

    it('does not snap to x-wall when element is completely above the box', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.y=20, height=20 → bottom=40 < yMin=100 → completely above → no x snap
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 105, y: 20 } })
      expect(r.snapped).toBe(false)
      expect(r.x).toBe(105)
    })

    it('does not snap to x-wall when element is completely below the box', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.y=210, height=20 → top=210 ≥ yMax=200 → completely below → no x snap
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 105, y: 210 } })
      expect(r.snapped).toBe(false)
      expect(r.x).toBe(105)
    })

    it('does not snap to y-wall when element is completely left of the box', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.x=10, width=20 → right=30 < xMin=100 → completely left → no y snap
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 10, y: 105 } })
      expect(r.snapped).toBe(false)
      expect(r.y).toBe(105)
    })

    it('does not snap to y-wall when element is completely right of the box', async () => {
      const box: SnapBoundingRect = { left: 100, top: 100, right: 200, bottom: 200 }
      // pos.x=210, width=20 → left=210 ≥ xMax=200 → completely right → no y snap
      const r = await dragSnap({ snap: { boundingBox: box, edge: 'inside' }, size: box20, to: { x: 210, y: 105 } })
      expect(r.snapped).toBe(false)
      expect(r.y).toBe(105)
    })

    it('snaps position during drag', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y, snapped } = useDraggable(el, {
            snap: { step: 30, x: { start: 0, end: 120 }, y: { start: 0, end: 120 } },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value, 'data-snapped': snapped.value })
        },
      })

      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()

      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 28, clientY: 58 }))
      await nextTick()

      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('30')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('60')
      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('true')
    })

    it('exposes snapped=false when outside gravity', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { snapped } = useDraggable(el, { snap: { x: 100, y: 100 } })
          return () => h('div', { 'ref': 'el', 'data-snapped': snapped.value })
        },
      })

      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      await nextTick()

      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }))
      await nextTick()

      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('false')
    })

    it('snapped defaults to false with no snap option', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { snapped } = useDraggable(el)
          return () => h('div', { 'ref': 'el', 'data-snapped': snapped.value })
        },
      })

      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('false')

      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 50 }))
      await nextTick()

      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('false')
    })

    it('snaps to an absolute point during drag', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y, snapped } = useDraggable(el, { snap: 60 })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value, 'data-snapped': snapped.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 55, clientY: 55 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('60')
      expect(wrapper.get('div').element.getAttribute('data-y')).toBe('60')
      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('true')
    })

    it('snaps to a bounding box wall during drag', async () => {
      const wrapper = mount({
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const { x, y, snapped } = useDraggable(el, {
            snap: { boundingBox: { left: 100, top: 100, right: 200, bottom: 200 }, edge: 'inside', gravity: 30 },
          })
          return () => h('div', { 'ref': 'el', 'data-x': x.value, 'data-y': y.value, 'data-snapped': snapped.value })
        },
      })
      await nextTick()
      wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 110, clientY: 150 }))
      await nextTick()
      expect(wrapper.get('div').element.getAttribute('data-x')).toBe('100')
      expect(wrapper.get('div').element.getAttribute('data-snapped')).toBe('true')
    })
  })
})

describe('useDraggable component storage', () => {
  it('persists position to sessionStorage via storageKey', async () => {
    const KEY = 'vueuse-draggable-test-pos'
    sessionStorage.removeItem(KEY)
    const wrapper = mount(UseDraggable, {
      attachTo: document.body,
      props: { storageKey: KEY, storageType: 'session', initialValue: { x: 0, y: 0 } },
      slots: {
        default: ({ x, y }: any) => h('span', { 'data-x': x, 'data-y': y }),
      },
    })
    await nextTick()
    wrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true }))
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 25 }))
    window.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    await nextTick()
    expect(JSON.parse(sessionStorage.getItem(KEY)!)).toMatchObject({ x: 40, y: 25 })
    wrapper.unmount()
  })
})
