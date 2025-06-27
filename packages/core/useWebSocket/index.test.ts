import type { UseWebSocketReturn } from './index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useSetup } from '../../.test'
import { useWebSocket } from './index'

describe('useWebSocket', () => {
  const mockWebSocket = vi.fn<(host: string) => WebSocket>()
  let vm: ReturnType<typeof useSetup<{ ref: UseWebSocketReturn<any> }>> | null = null

  mockWebSocket.prototype.send = vi.fn()
  mockWebSocket.prototype.close = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('WebSocket', mockWebSocket)
  })

  afterEach(() => {
    vm?.unmount()
    vi.unstubAllGlobals()
  })

  it('should be defined', () => {
    expect(useWebSocket).toBeDefined()
  })

  it('should initialise web socket', () => {
    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost')

      return {
        ref,
      }
    })

    expect(vm.ref.data.value).toBe(null)
    expect(vm.ref.status.value).toBe('CONNECTING')
    expect(mockWebSocket).toBeCalledWith('ws://localhost', [])
    expect(vm.ref.close).toBeDefined()
    expect(vm.ref.send).toBeDefined()
    expect(vm.ref.open).toBeDefined()
    expect(vm.ref.ws.value).toBeDefined()
  })

  it('should reconnect if URL changes', async () => {
    const url = shallowRef('ws://localhost')
    vm = useSetup(() => {
      const ref = useWebSocket(url)

      return {
        ref,
      }
    })

    url.value = 'ws://127.0.0.1'
    await nextTick()

    expect(mockWebSocket.prototype.close).toBeCalledWith(1000, undefined)
    expect(mockWebSocket).toBeCalledWith('ws://127.0.0.1', [])
    expect(vm.ref.status.value).toBe('CONNECTING')
  })

  it('should not reconnect on URL change if immediate and autoConnect are false', async () => {
    const url = shallowRef('ws://localhost')
    vm = useSetup(() => {
      const ref = useWebSocket(url, {
        immediate: false,
        autoConnect: false,
      })

      return {
        ref,
      }
    })

    url.value = 'ws://127.0.0.1'
    await nextTick()

    expect(mockWebSocket.prototype.close).not.toHaveBeenCalled()
    expect(mockWebSocket).not.toHaveBeenCalledWith('ws://127.0.0.1', [])
    expect(vm.ref.status.value).toBe('CLOSED')
  })

  it('should remain closed if immediate is false', () => {
    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost', {
        immediate: false,
      })

      return {
        ref,
      }
    })

    expect(vm.ref.status.value).toBe('CLOSED')
  })

  describe('open', () => {
    it('should reconnect if called while still open', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost')

        return {
          ref,
        }
      })

      expect(vm.ref.status.value).toBe('CONNECTING')
      expect(mockWebSocket).toHaveBeenCalledTimes(1)

      vm.ref.open()

      expect(vm.ref.status.value).toBe('CONNECTING')
      expect(mockWebSocket).toHaveBeenCalledTimes(2)
    })

    it('should open socket', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost', {
          immediate: false,
        })

        return {
          ref,
        }
      })

      expect(vm.ref.status.value).toBe('CLOSED')
      expect(mockWebSocket).not.toHaveBeenCalled()

      vm.ref.open()

      expect(vm.ref.status.value).toBe('CONNECTING')
      expect(mockWebSocket).toBeCalledWith('ws://localhost', [])
    })
  })

  describe('close', () => {
    it('should close socket', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost')

        return {
          ref,
        }
      })

      expect(vm.ref.status.value).toBe('CONNECTING')

      vm.ref.close()

      expect(mockWebSocket.prototype.close).toBeCalledWith(1000, undefined)
    })
  })

  describe('autoClose', () => {
    it('should close on unload if true', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost', {
          autoClose: true,
        })

        return {
          ref,
        }
      })

      window.dispatchEvent(new Event('beforeunload'))

      expect(mockWebSocket.prototype.close).toHaveBeenCalled()
    })

    it.skip('should close when scope disposed if true')

    it('should not close on unload if false', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost', {
          autoClose: false,
        })

        return {
          ref,
        }
      })

      window.dispatchEvent(new Event('beforeunload'))

      expect(mockWebSocket.prototype.close).not.toHaveBeenCalled()
    })
  })

  it('should set data on message', () => {
    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost')

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    const ev = new MessageEvent('message', {
      data: 'bleep bloop',
    })

    vm.ref.ws.value?.onmessage?.(ev)

    expect(vm.ref.data.value).toBe('bleep bloop')
  })

  it('should call onMessage on message', () => {
    const onMessage = vi.fn()

    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost', { onMessage })

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    const ev = new MessageEvent('message', {
      data: 'bleep bloop',
    })

    vm.ref.ws.value?.onmessage?.(ev)

    expect(onMessage).toBeCalledWith(vm.ref.ws.value, ev)
  })

  it('should call onError on error', () => {
    const onError = vi.fn()

    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost', { onError })

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    const ev = new Event('error')

    vm.ref.ws.value?.onerror?.(ev)

    expect(onError).toBeCalledWith(vm.ref.ws.value, ev)
  })

  it('should call onDisconnected on close', () => {
    const onDisconnected = vi.fn()

    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost', { onDisconnected })

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    const ev = new CloseEvent('close')

    vm.ref.ws.value?.onclose?.(ev)

    expect(onDisconnected).toBeCalledWith(vm.ref.ws.value, ev)
  })

  it('should be CLOSED on close', () => {
    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost')

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    expect(vm.ref.status.value).toBe('OPEN')

    vm.ref.ws.value?.onclose?.(new CloseEvent('close'))

    expect(vm.ref.status.value).toBe('CLOSED')
  })

  it('should be OPEN on open', () => {
    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost')

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    expect(vm.ref.status.value).toBe('OPEN')
  })

  it('should call onConnected on open', () => {
    const onConnected = vi.fn()

    vm = useSetup(() => {
      const ref = useWebSocket('ws://localhost', { onConnected })

      return {
        ref,
      }
    })

    vm.ref.ws.value?.onopen?.(new Event('open'))

    expect(onConnected).toBeCalledWith(vm.ref.ws.value)
  })

  describe('send', () => {
    it('should buffer data until connect if buffer=true', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost')

        return {
          ref,
        }
      })

      vm.ref.send('bleep bloop', true)

      vm.ref.ws.value?.onopen?.(new Event('open'))

      expect(mockWebSocket.prototype.send).toBeCalledWith('bleep bloop')
    })

    it('should send data', () => {
      vm = useSetup(() => {
        const ref = useWebSocket('ws://localhost')

        return {
          ref,
        }
      })

      vm.ref.ws.value?.onopen?.(new Event('open'))

      vm.ref.send('bleep bloop')

      expect(mockWebSocket.prototype.send).toBeCalledWith('bleep bloop')
    })
  })

  describe('heartbeat', () => {
    vi.useFakeTimers()

    it('should send a heartbeat if heartbeat=true', async () => {
      vm = useSetup(() => {
        const ref = useWebSocket('wss://server.example.com', {
          heartbeat: {
            interval: 500,
          },
        })

        return {
          ref,
        }
      })

      vm.ref.ws.value?.onopen?.(new Event('open'))
      await vi.advanceTimersByTimeAsync(500)
      expect(mockWebSocket.prototype.send).toBeCalledWith('ping')
    })
    it('should not send a heartbeat if heartbeat=false', async () => {
      vm = useSetup(() => {
        const ref = useWebSocket('wss://server.example.com', {
          heartbeat: false,
        })

        return {
          ref,
        }
      })

      vm.ref.ws.value?.onopen?.(new Event('open'))
      await vi.advanceTimersByTimeAsync(500)
      expect(mockWebSocket.prototype.send).not.toHaveBeenCalled()
    })
    it('should call close on pongTimeout', async () => {
      vm = useSetup(() => {
        const ref = useWebSocket('wss://server.example.com', {
          heartbeat: {
            interval: 500,
            pongTimeout: 1000,
          },
        })

        return {
          ref,
        }
      })

      vm.ref.ws.value?.onopen?.(new Event('open'))
      expect(vm.ref.status.value).toBe('OPEN')
      mockWebSocket.prototype.close.mockClear()
      await vi.advanceTimersByTimeAsync(1499)
      expect(mockWebSocket.prototype.close).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      expect(mockWebSocket.prototype.close).toHaveBeenCalledOnce()
    })
    it('should not call close on pongTimeout if connection already closed', async () => {
      vm = useSetup(() => {
        const ref = useWebSocket('wss://server.example.com', {
          heartbeat: {
            message: 'ping',
            interval: 500,
            pongTimeout: 1000,
          },
        })

        return {
          ref,
        }
      })
      vm.ref.ws.value?.onopen?.(new Event('open'))
      expect(vm.ref.status.value).toBe('OPEN')
      const ev = new CloseEvent('close')
      vm.ref.ws.value?.onclose?.(ev)
      expect(vm.ref.status.value).toBe('CLOSED')
      mockWebSocket.prototype.close.mockClear()
      await vi.advanceTimersByTimeAsync(1500)
      expect(mockWebSocket.prototype.close).not.toHaveBeenCalled()
    })
    it('should not send a heartbeat if the connection is closed', async () => {
      const messageSpy = vi.fn(() => 'ping')
      vm = useSetup(() => {
        const ref = useWebSocket('wss://server.example.com', {
          heartbeat: {
            message: messageSpy,
            interval: 500,
            pongTimeout: 1000,
          },
        })

        return {
          ref,
        }
      })
      expect(vm.ref.status.value).toBe('CONNECTING')
      vm.ref.ws.value?.onopen?.(new Event('open'))
      expect(vm.ref.status.value).toBe('OPEN')
      await vi.advanceTimersByTimeAsync(500)
      expect(messageSpy).toHaveBeenCalledTimes(1)
      vm.ref.ws.value?.onclose?.(new CloseEvent('close'))
      expect(vm.ref.status.value).toBe('CLOSED')
      await vi.advanceTimersByTimeAsync(2500)
      expect(messageSpy).toHaveBeenCalledTimes(1)
    })
  })
})
