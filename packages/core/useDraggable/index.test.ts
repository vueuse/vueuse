import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import type { UseDraggableOptions } from './index'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import { useDraggable } from './index'

export const baseMousePointerEventOptions = {
  bubbles: true,
  cancelable: true,
  pointerType: 'mouse',
}

export interface DraggableComponentOptions {
  template?: string
  useDraggableOptions?: UseDraggableOptions
  setupFn?: (useDraggableOptions: UseDraggableOptions) => Record<string, any>
}

export function createDraggableComponent({
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

export interface SimulateDragOptions {
  start?: { x: number, y: number }
  move?: { x: number, y: number }
  initialValue?: { x: number, y: number }
  checkIsDragging?: boolean
}

export async function simulateDrag(
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

export async function endDrag(wrapper: VueWrapper<any>): Promise<void> {
  const pointerUpEvent = new PointerEvent('pointerup', baseMousePointerEventOptions)
  document.dispatchEvent(pointerUpEvent)
  await nextTick()

  expect(wrapper.vm.isDragging).toBe(false)

  wrapper.unmount()
}

describe('useDraggable', () => {
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
