import { nextTick } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import type { WakeLockSentinel } from '.'
import { useWakeLock } from '.'

describe('useWakeLock', () => {
  it('isActive not changed if not supported', async () => {
    const { isActive, request, release } = useWakeLock({ navigator: {} as Navigator })

    expect(isActive.value).toBeFalsy()

    await request('screen')

    expect(isActive.value).toBeFalsy()

    await release()

    expect(isActive.value).toBeFalsy()
  })

  it('isActive changed if supported', async () => {
    const createWakeLock = () => {
      let _released = false
      return {
        get released() {
          return _released
        },
        release: () => {
          _released = true
          return Promise.resolve()
        },
      } as WakeLockSentinel
    }

    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: () => createWakeLock() },
      writable: true,
    })
    const { isActive, request, release } = useWakeLock()

    expect(isActive.value).toBeFalsy()

    await request('screen')

    expect(isActive.value).toBeTruthy()

    await release()

    expect(isActive.value).toBeFalsy()
  })

  it('isActive changed if show other tabs or minimize window', async () => {
    const createWakeLock = () => {
      let _released = false
      return {
        get released() {
          return _released
        },
        release: () => {
          _released = true
          return Promise.resolve()
        },
      } as WakeLockSentinel
    }

    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: () => createWakeLock() },
      writable: true,
    })
    const { isActive, request } = useWakeLock()

    expect(isActive.value).toBeFalsy()

    await request('screen')
    await promiseTimeout(10)

    expect(isActive.value).toBeTruthy()

    document.dispatchEvent(new window.Event('visibilitychange'))

    await nextTick()

    expect(isActive.value).toBeTruthy()
  })
})
