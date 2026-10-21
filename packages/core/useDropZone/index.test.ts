import { describe, expect, it, vi } from 'vitest'
import { useDropZone } from './index'

function createDragEvent(
  type: string,
  options: {
    files?: File[]
    items?: Array<Pick<DataTransferItem, 'kind' | 'type'>>
  } = {},
) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as DragEvent

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'move',
      files: options.files ?? [],
      items: options.items ?? [],
    },
  })

  return event
}

describe('useDropZone', () => {
  it('validates file data types on drop when drag items are unavailable', () => {
    const target = document.createElement('div')
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    const onDrop = vi.fn()

    const { files, isOverDropZone } = useDropZone(target, {
      dataTypes: ['image/png'],
      onDrop,
    })

    target.dispatchEvent(createDragEvent('dragenter'))

    expect(isOverDropZone.value).toBe(true)

    target.dispatchEvent(createDragEvent('drop', { files: [file] }))

    expect(files.value).toEqual([file])
    expect(isOverDropZone.value).toBe(false)
    expect(onDrop).toHaveBeenCalledWith([file], expect.any(Event))
  })

  it('rejects files with unsupported data types when validation is deferred to drop', () => {
    const target = document.createElement('div')
    const file = new File(['text'], 'file.txt', { type: 'text/plain' })
    const onDrop = vi.fn()

    const { files, isOverDropZone } = useDropZone(target, {
      dataTypes: ['image/png'],
      onDrop,
    })

    target.dispatchEvent(createDragEvent('dragenter'))

    expect(isOverDropZone.value).toBe(true)

    target.dispatchEvent(createDragEvent('drop', { files: [file] }))

    expect(files.value).toBeNull()
    expect(isOverDropZone.value).toBe(false)
    expect(onDrop).not.toHaveBeenCalled()
  })

  it('rejects unsupported data types immediately when drag item types are available', () => {
    const target = document.createElement('div')
    const onEnter = vi.fn()

    const { isOverDropZone } = useDropZone(target, {
      dataTypes: ['image/png'],
      onEnter,
    })

    const event = createDragEvent('dragenter', {
      items: [{ kind: 'file', type: 'text/plain' }],
    })

    target.dispatchEvent(event)

    expect(isOverDropZone.value).toBe(false)
    expect(event.dataTransfer?.dropEffect).toBe('none')
    expect(onEnter).not.toHaveBeenCalled()
  })
})
