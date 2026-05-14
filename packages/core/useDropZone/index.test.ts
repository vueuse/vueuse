import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, useTemplateRef } from 'vue'
import { useDropZone } from './index'

function createDragEvent(type: string) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as DragEvent

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'move',
      files: [],
      items: [{ type: 'text/plain' }],
    },
  })

  return event
}

describe('useDropZone', () => {
  it('resets the enter counter on dragover', async () => {
    let dropZone!: ReturnType<typeof useDropZone>

    const wrapper = mount({
      setup() {
        const target = useTemplateRef<HTMLElement>('target')
        dropZone = useDropZone(target)

        return () => h('div', {
          ref: 'target',
        })
      },
    })

    await nextTick()

    const target = wrapper.get('div').element

    target.dispatchEvent(createDragEvent('dragenter'))
    target.dispatchEvent(createDragEvent('dragenter'))
    expect(dropZone.isOverDropZone.value).toBe(true)

    target.dispatchEvent(createDragEvent('dragover'))
    target.dispatchEvent(createDragEvent('dragleave'))

    expect(dropZone.isOverDropZone.value).toBe(false)

    wrapper.unmount()
  })
})
