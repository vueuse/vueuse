import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useTextareaAutosize } from './index'

describe('useTextareaAutosize', () => {
  it('should cap textarea height with maxHeight', () => {
    const textarea = document.createElement('textarea')

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 240,
    })

    const { triggerResize } = useTextareaAutosize({
      element: textarea,
      maxHeight: 120,
    })

    triggerResize()

    expect(textarea.style.height).toBe('120px')
  })

  it('should keep rows support with minHeight and maxHeight', () => {
    const textarea = document.createElement('textarea')

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 240,
    })

    const { triggerResize } = useTextareaAutosize({
      element: textarea,
      maxHeight: 120,
      styleProp: 'minHeight',
    })

    triggerResize()

    expect(textarea.style.minHeight).toBe('120px')
  })

  it('should set textarea height to scrollHeight when no maxHeight', () => {
    const textarea = document.createElement('textarea')

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 180,
    })

    const { triggerResize } = useTextareaAutosize({ element: textarea })

    triggerResize()

    expect(textarea.style.height).toBe('180px')
  })

  it('should not resize when scrollHeight is below maxHeight', () => {
    const textarea = document.createElement('textarea')

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 80,
    })

    const { triggerResize } = useTextareaAutosize({
      element: textarea,
      maxHeight: 120,
    })

    triggerResize()

    expect(textarea.style.height).toBe('80px')
  })

  it('should apply height to styleTarget when provided', () => {
    const textarea = document.createElement('textarea')
    const styleTarget = document.createElement('div')

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 240,
    })

    const { triggerResize } = useTextareaAutosize({
      element: textarea,
      styleTarget,
      maxHeight: 120,
    })

    triggerResize()

    expect(styleTarget.style.height).toBe('120px')
    expect(textarea.style.height).toBe('')
  })

  it('should call onResize when textarea scroll height changes', async () => {
    const textarea = document.createElement('textarea')
    const onResize = vi.fn()

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 100,
    })

    const { triggerResize } = useTextareaAutosize({
      element: textarea,
      onResize,
    })

    triggerResize()

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onResize).toHaveBeenCalled()
  })

  it('should do nothing when textarea element is not set', () => {
    const { triggerResize } = useTextareaAutosize({})

    expect(() => triggerResize()).not.toThrow()
  })

  it('should trigger resize when watch source changes', async () => {
    const textarea = document.createElement('textarea')
    const source = shallowRef(0)

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 100,
    })

    const { triggerResize: _ } = useTextareaAutosize({
      element: textarea,
      watch: source,
    })

    source.value = 1

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(textarea.style.height).toBe('100px')
  })
})
