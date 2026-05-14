import { describe, expect, it } from 'vitest'
import { useDropZone } from './index'

function createDragEvent(type: string) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as DragEvent
  const items = [{ type: 'text/plain' }] as DataTransferItem[]

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'none',
      files: [],
      items,
    },
  })

  return event
}

describe('useDropZone', () => {
  it('resets stale nested drag counters on dragover', () => {
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
