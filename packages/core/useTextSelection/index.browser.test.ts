import { describe, expect, it } from 'vitest'
import { useTextSelection } from './index'

describe('useTextSelection', () => {
  it('should initialise', async () => {
    const result = useTextSelection()
    expect(result.text.value).toBe('')
    expect(result.rects.value).toEqual([])
    expect(result.ranges.value).toEqual([])
    expect(result.selection.value).toBe(null)
  })

  it('should update on selection change', async () => {
    const result = useTextSelection()
    const div = document.createElement('div')
    div.id = 'test'
    div.textContent = 'Hello World'
    document.body.appendChild(div)

    try {
      const range = document.createRange()
      range.selectNodeContents(div)
      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const event = new Event('selectionchange')
      document.dispatchEvent(event)

      expect(result.text.value).toBe('Hello World')
      expect(result.ranges.value.length).toBe(1)
      expect(result.rects.value.length).toBe(1)
      expect(result.selection.value).toBe(selection)
    }
    finally {
      div.remove()
    }
  })
})
