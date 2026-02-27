import { mount } from '@vue/test-utils'
import {
  useWebLocks,
  useWebLocksAbortLockHeld,
  useWebLocksAbortLockStolen,
  useWebLocksAbortScopeDisposed,
  type UseWebLocksReturn,
} from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'
import { beforeEach, describe, expect, it } from 'vitest'

function nextFrame() {
  return promiseTimeout(15) // we assume that browser can handle lock requests in this time
}

describe('useWebLocks', () => {
  it('should be supported', () => {
    const { isSupported } = useWebLocks()
    expect(isSupported.value).toBe(true)
  })

  it('should let navigator be passed', () => {
    const { isSupported } = useWebLocks({ navigator: {} as unknown as Navigator })
    expect(isSupported.value).toBe(false)
  })

  it('should get lock', async () => {
    await expect(useWebLocks().request('lock-1', () => true)).resolves.toBe(true)
  })

  it('should get nested locks', async () => {
    const { request } = useWebLocks<{ 'lock-1': true, 'lock-2': true }>()
    await expect(request('lock-1', async () => await request('lock-2', () => true))).resolves.toBe(true)
  })

  it('should queue lock requests', async () => {
    const lockName = 'lock-3'
    const { request } = useWebLocks<{ [lockName]: number }>()
    let inLock = false
    let counter = 0
    async function callback() {
      if (inLock) {
        throw new Error('requests not serialized')
      }
      inLock = true
      await nextFrame()
      inLock = false
      return ++counter
    }
    const calls = [request(lockName, callback), request(lockName, callback), request(lockName, callback)]
    await expect(Promise.all(calls)).resolves.toStrictEqual([1, 2, 3])
  })

  it('should throw error calling request without a callback', async () => {
    const { request } = useWebLocks()
    await expect(request('_', undefined as unknown as () => void)).rejects.toThrow('callback not provided')
    await expect(request('_', {} as unknown as () => void)).rejects.toThrow('callback not provided')
    await expect(request('_', {}, undefined as unknown as () => void)).rejects.toThrow('callback not provided')
  })

  describe('should', () => {
    let capturedRequest: UseWebLocksReturn['request'] | undefined
    let capturedSupported: UseWebLocksReturn['isSupported'] | undefined
    const component = {
      template: '<span></span>',
      setup() {
        const { isSupported, request } = useWebLocks()
        capturedRequest = request
        capturedSupported = isSupported
      },
    }

    beforeEach(() => {
      capturedRequest = undefined
      capturedSupported = undefined
    })

    it('release lock on unmount', async () => {
      const wrapper1 = mount(component)
      expect(capturedSupported!.value).toBe(true)
      let caughtRejection: any
      capturedRequest!('lock-4', () => new Promise(() => { /* never release lock */ })).catch(reason => caughtRejection = reason)
      wrapper1.unmount()
      await nextFrame()
      expect(caughtRejection).toBe(useWebLocksAbortScopeDisposed)
      const wrapper2 = mount(component)
      await expect(capturedRequest!('lock-4', async () => {
        await nextFrame()
        return true
      })).resolves.toBe(true)
      wrapper2.unmount()
    })

    it('throw error calling request after scope was disposed', async () => {
      const wrapper1 = mount(component)
      wrapper1.unmount()
      await nextFrame()
      await expect(capturedRequest!('lock-4', () => true)).rejects.toThrow('called request after scope was already disposed')
    })

    it('handle ifAvailable', async () => {
      const wrapper1 = mount(component)
      expect(await capturedRequest!('lock-5', { ifAvailable: true }, () => true)).toBe(true)
      const p = capturedRequest!('lock-5', async () => await promiseTimeout(250)).then()
      await expect(capturedRequest!('lock-5', { ifAvailable: true }, () => true)).rejects.toBe(useWebLocksAbortLockHeld)
      await p
      wrapper1.unmount()
    })

    it('handle steal', async () => {
      const wrapper1 = mount(component)
      expect(await capturedRequest!('lock-6', { steal: true }, () => true)).toBe(true)
      await promiseTimeout(100)
      const p = capturedRequest!('lock-6', async () => await promiseTimeout(500))
      const start = Date.now()
      expect(await capturedRequest!('lock-6', { steal: true }, () => true)).toBe(true)
      expect(Date.now() - start).toBeLessThan(250)
      await expect(p).rejects.toBe(useWebLocksAbortLockStolen)
      wrapper1.unmount()
    })

    it('handle signal', async () => {
      const wrapper1 = mount(component)
      const p = capturedRequest!('lock-7', async () => await promiseTimeout(500))
      const abortController = new AbortController()
      setTimeout(() => abortController.abort('waited long enough'), 250)
      await expect(capturedRequest!('lock-7', { signal: abortController.signal }, () => true)).rejects.toBe('waited long enough')
      expect(await p).toBe(undefined)
      wrapper1.unmount()
    })

    it('signal only relevant for lock request', async () => {
      const wrapper1 = mount(component)
      const abortController = new AbortController()
      setTimeout(() => abortController.abort('waited long enough'), 50)
      expect(await capturedRequest!('lock-8', { signal: abortController.signal }, async (signal) => {
        await promiseTimeout(100)
        signal.throwIfAborted()
        return true
      })).toBe(true)
      wrapper1.unmount()
    })
  })

  it('should honor forceRelease = false', async () => {
    let capturedRequest: UseWebLocksReturn['request'] | undefined
    const wrapper1 = mount({
      template: '<span></span>',
      setup() {
        const { request } = useWebLocks({ forceRelease: false })
        capturedRequest = request
      },
    })
    let capturedSignalReason: any
    const p = capturedRequest!('lock-9', async (signal) => {
      await promiseTimeout(250)
      capturedSignalReason = signal.reason
      return true
    })
    await nextFrame()
    wrapper1.unmount()
    await nextFrame()
    expect(await p).toBe(true)
    expect(capturedSignalReason).toBe(useWebLocksAbortScopeDisposed)
  })

  it('should honor forceRelease = true', async () => {
    let capturedRequest: UseWebLocksReturn['request'] | undefined
    const wrapper1 = mount({
      template: '<span></span>',
      setup() {
        const { request } = useWebLocks({ forceRelease: true })
        capturedRequest = request
      },
    })
    let capturedRejection: any
    const p = capturedRequest!('lock-10', async () => {
      await promiseTimeout(250)
      return true
    }).catch(reason => capturedRejection = reason)
    await nextFrame()
    wrapper1.unmount()
    await nextFrame()
    expect(await p).not.toBe(true)
    expect(capturedRejection).toBe(useWebLocksAbortScopeDisposed)
  })
})
