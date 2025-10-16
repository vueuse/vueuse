import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTextSelection } from './index'

describe('useTextSelection', () => {
  let node: HTMLElement

  beforeEach(() => {
    node = document.createElement('div')
    node.id = 'test'
    node.textContent = 'Hello World'
    document.body.appendChild(node)
  })

  afterEach(() => {
    node.remove()
    window.getSelection()?.removeAllRanges()
  })

  it('should initialise', async () => {
    const result = useTextSelection()
    expect(result.text.value).toBe('')
    expect(result.rects.value).toEqual([])
    expect(result.ranges.value).toEqual([])
    expect(result.selection.value).toBe(null)
  })

  it('should update on selection change', async () => {
    const result = useTextSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    const selection = window.getSelection()!
    selection.addRange(range)

    const event = new Event('selectionchange')
    document.dispatchEvent(event)

    expect(result.text.value).toBe('Hello World')
    expect(result.ranges.value.length).toBe(1)
    expect(result.rects.value.length).toBe(1)
    expect(result.selection.value).toBe(selection)
  })
})
