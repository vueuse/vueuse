import type { IpcRenderer } from 'electron'
import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'
import { useIpcRenderer } from './index'

describe('useIpcRenderer', () => {
  it('removes only the specified listener through off', () => {
    const renderer = Object.assign(new EventEmitter(), {
      sendSync: vi.fn(),
    }) as unknown as IpcRenderer
    const listener = vi.fn()
    const otherListener = vi.fn()
    renderer.on('message', listener)
    renderer.on('message', otherListener)

    const ipc = useIpcRenderer(renderer)
    expect(ipc.off('message', listener)).toBe(renderer)
    renderer.emit('message', {}, 'data')

    expect(listener).not.toHaveBeenCalled()
    expect(otherListener).toHaveBeenCalledWith({}, 'data')
  })
})
