import { describe, expect, it } from 'vitest'
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
})
