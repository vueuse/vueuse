import { describe, expect, it } from 'vitest'
import { useDropZone } from './index'

function createDragEvent(type: string) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'move',
      files: [],
      items: [],
    },
  })

  return event
}

describe('useDropZone', () => {
  it('resets nested drag state on dragover so dragleave clears the drop zone', () => {
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
