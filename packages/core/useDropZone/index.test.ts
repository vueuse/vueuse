import { describe, expect, it } from 'vitest'
import { useDropZone } from './index'

function createDragEvent(type: string) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'none',
      files: [],
      items: [{ type: 'text/plain' }],
    },
  })

  return event
}

describe('useDropZone', () => {
  it('resets the drag counter on dragover', () => {
    const target = document.createElement('div')
    const { isOverDropZone } = useDropZone(target)

    target.dispatchEvent(createDragEvent('dragenter'))
    target.dispatchEvent(createDragEvent('dragenter'))

    expect(isOverDropZone.value).toBe(true)

    target.dispatchEvent(createDragEvent('dragover'))
    target.dispatchEvent(createDragEvent('dragleave'))

    expect(isOverDropZone.value).toBe(false)
  })
})
