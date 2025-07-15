import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { UseDraggableOptions } from './index'
import { mount } from '@vue/test-utils'
import { useDraggable } from '@vueuse/core'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, shallowRef, useTemplateRef } from 'vue'

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

      const el = shallowRef<HTMLElement>()

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

      expect(container.scrollLeft).toBeGreaterThan(130)

      dispatchPointerUp()
      wrapper.unmount()
    })
  })
})
