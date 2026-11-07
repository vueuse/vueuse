import type { IpcRenderer } from 'electron'
import { EventEmitter } from 'node:events'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useIpcRenderer } from './index'

describe('useIpcRenderer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('registers on the supplied renderer and removes the listener on scope disposal', () => {
    vi.stubGlobal('require', undefined)
    const renderer = Object.assign(new EventEmitter(), {
      sendSync: vi.fn(),
    }) as unknown as IpcRenderer
    const listener = vi.fn()
    const scope = effectScope()

    try {
      scope.run(() => {
        const ipc = useIpcRenderer(renderer)
        expect(ipc.on('message', listener)).toBe(renderer)
      })

      renderer.emit('message', {}, 'first')
      expect(listener).toHaveBeenCalledWith({}, 'first')
      scope.stop()
      renderer.emit('message', {}, 'second')
      expect(listener).toHaveBeenCalledTimes(1)
      expect(renderer.listenerCount('message')).toBe(0)
    }
    finally {
      scope.stop()
    }
  })
})
