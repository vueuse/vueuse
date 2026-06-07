import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useCanvas2D } from './index'

describe('useCanvas2D', () => {
  it('should be defined', () => {
    expect(useCanvas2D).toBeDefined()
  })

  it('should return null context without a canvas', () => {
    const canvas = shallowRef<HTMLCanvasElement | null>(null)

    const { context } = useCanvas2D(canvas)

    expect(context.value).toBeNull()
  })

  it('should get 2d context from an initial canvas', () => {
    const options: CanvasRenderingContext2DSettings = { willReadFrequently: true }
    const renderingContext = {} as CanvasRenderingContext2D
    const element = document.createElement('canvas')
    const getContext = vi.fn(() => renderingContext)
    Object.defineProperty(element, 'getContext', {
      value: getContext,
    })

    const { context } = useCanvas2D(element, options)

    expect(getContext).toHaveBeenCalledWith('2d', options)
    expect(context.value).toBe(renderingContext)
  })

  it('should get 2d context when the canvas changes', async () => {
    const canvas = shallowRef<HTMLCanvasElement | null>(null)
    const options: CanvasRenderingContext2DSettings = { alpha: false }
    const renderingContext = {} as CanvasRenderingContext2D
    const element = document.createElement('canvas')
    const getContext = vi.fn(() => renderingContext)
    Object.defineProperty(element, 'getContext', {
      value: getContext,
    })

    const { context } = useCanvas2D(canvas, options)

    canvas.value = element
    await nextTick()

    expect(getContext).toHaveBeenCalledWith('2d', options)
    expect(context.value).toBe(renderingContext)

    canvas.value = null
    await nextTick()

    expect(context.value).toBeNull()
  })

  it('should return null context when getContext returns null', () => {
    const element = document.createElement('canvas')
    const getContext = vi.fn(() => null)
    Object.defineProperty(element, 'getContext', {
      value: getContext,
    })

    const { context } = useCanvas2D(element)

    expect(getContext).toHaveBeenCalledWith('2d', {})
    expect(context.value).toBeNull()
  })
})
