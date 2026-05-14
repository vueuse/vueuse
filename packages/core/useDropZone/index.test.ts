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
  it('should be defined', () => {
    expect(useDropZone).toBeDefined()
  })

  it('should reset hover state when a nested dragleave is missed', () => {
    const target = document.createElement('div')
    const child = document.createElement('div')
    target.appendChild(child)

    const { isOverDropZone } = useDropZone(target)

    target.dispatchEvent(createDragEvent('dragenter'))
    child.dispatchEvent(createDragEvent('dragenter'))
    expect(isOverDropZone.value).toBe(true)

    child.remove()
    target.dispatchEvent(createDragEvent('dragover'))
    target.dispatchEvent(createDragEvent('dragleave'))

    expect(isOverDropZone.value).toBe(false)
  })
})
