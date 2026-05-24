import { describe, expect, it, vi } from 'vitest'
import { useDropZone } from './index'

function createDragEvent(type: string, dataTransfer: Partial<DataTransfer>) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent

  Object.defineProperty(event, 'dataTransfer', {
    value: dataTransfer,
  })

  return event
}

function createDataTransfer(files: File[], items: Partial<DataTransferItem>[] = []) {
  return {
    dropEffect: 'none',
    files,
    items,
  } as unknown as DataTransfer
}

describe('useDropZone', () => {
  it('validates dropped files when drag item types are unavailable', () => {
    const target = document.createElement('div')
    const onDrop = vi.fn()
    const image = new File(['content'], 'image.png', { type: 'image/png' })

    const { files } = useDropZone(target, {
      dataTypes: ['image/png'],
      onDrop,
    })

    target.dispatchEvent(createDragEvent('dragenter', createDataTransfer([], [])))
    target.dispatchEvent(createDragEvent('drop', createDataTransfer([image], [])))

    expect(files.value).toEqual([image])
    expect(onDrop).toHaveBeenCalledWith([image], expect.any(Event))
  })

  it('rejects dropped files with unavailable drag item types when the file type is invalid', () => {
    const target = document.createElement('div')
    const onDrop = vi.fn()
    const text = new File(['content'], 'notes.txt', { type: 'text/plain' })

    const { files } = useDropZone(target, {
      dataTypes: ['image/png'],
      onDrop,
    })

    target.dispatchEvent(createDragEvent('drop', createDataTransfer([text], [])))

    expect(files.value).toBeNull()
    expect(onDrop).not.toHaveBeenCalled()
  })
})
