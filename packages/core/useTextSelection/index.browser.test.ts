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

  const addNodeContentToRange = (node: HTMLElement) => {
    const range = document.createRange()
    range.selectNodeContents(node)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)

    document.dispatchEvent(new Event('selectionchange'))
  }

  it('should initialize with window.getSelection(), which is always present in browsers', async () => {
    const result = useTextSelection()
    expect(result.text.value).toBe('')
    expect(result.rects.value).toEqual([])
    expect(result.ranges.value).toEqual([])
    expect(result.selection.value).toBe(window.getSelection())
  })

  it('should initialize with an existing range', async () => {
    addNodeContentToRange(node)

    const result = useTextSelection()

    expect(result.text.value).toBe('Hello World')
    expect(result.ranges.value.length).toBe(1)
    expect(result.rects.value.length).toBe(1)
    expect(result.selection.value).toBe(window.getSelection())
  })

  it('should update on selectionchange', async () => {
    const result = useTextSelection()

    addNodeContentToRange(node)

    expect(result.text.value).toBe('Hello World')
    expect(result.ranges.value.length).toBe(1)
    expect(result.rects.value.length).toBe(1)
    expect(result.selection.value).toBe(window.getSelection())

    window.getSelection()?.removeAllRanges()
    document.dispatchEvent(new Event('selectionchange'))

    expect(result.text.value).toBe('')
    expect(result.ranges.value.length).toBe(0)
    expect(result.rects.value.length).toBe(0)
    expect(result.selection.value).toBe(window.getSelection())
  })
})
