import { page, userEvent } from '@vitest/browser/context'
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

  const selectHelloWorldNode = async () => {
    // triple click to select the whole text node
    await page.getByText('Hello World').tripleClick()
  }
  const clickOutside = async () => {
    await userEvent.click(document.body)
  }

  it('selection should always return the singleton Selection object no matter how the selection changes', async () => {
    const windowSelection = window.getSelection()
    expect(windowSelection).not.toBeNull()

    const result = useTextSelection()
    expect(result.selection.value).toBe(windowSelection)

    await selectHelloWorldNode()
    expect(result.selection.value).toBe(windowSelection)

    await clickOutside()
    expect(result.selection.value).toBe(windowSelection)
  })

  it('should initialize with window.getSelection(), which is always present in browsers', async () => {
    const result = useTextSelection()
    expect(result.text.value).toBe('')
    expect(result.rects.value).toEqual([])
    expect(result.ranges.value).toEqual([])
    expect(result.selection.value!.anchorNode).toBe(null)
    expect(result.selection.value!.focusNode).toBe(null)
  })

  it('should initialize with an existing range', async () => {
    await selectHelloWorldNode()

    const result = useTextSelection()

    expect(result.text.value).toBe('Hello World')
    expect(result.ranges.value.length).toBe(1)
    expect(result.rects.value.length).toBe(1)
    expect(result.selection.value!.anchorNode).toBe(node.firstChild)
    expect(result.selection.value!.focusNode).toBe(node.firstChild)
  })

  it('should update on selectionchange', async () => {
    const result = useTextSelection()

    await selectHelloWorldNode()

    expect(result.text.value).toBe('Hello World')
    expect(result.ranges.value.length).toBe(1)
    expect(result.rects.value.length).toBe(1)
    expect(result.selection.value!.anchorNode).toBe(node.firstChild)
    expect(result.selection.value!.focusNode).toBe(node.firstChild)

    await clickOutside()

    expect(result.text.value).toBe('')
    expect(result.ranges.value.length).toBe(0)
    expect(result.rects.value.length).toBe(0)
    expect(result.selection.value!.anchorNode).toBe(null)
    expect(result.selection.value!.focusNode).toBe(null)
  })
})
