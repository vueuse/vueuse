import { effectScope, nextTick, ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import type { Pausable } from '../utils'
import { useIntervalFn } from './index'

describe('useIntervalFn', () => {
  let callback = vi.fn()

  beforeEach(() => {
    callback = vi.fn()
  })

  async function exec({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(0)

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(2)
  }

  async function execImmediateCallback({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(1)

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(2)

    pause()
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(2)

    resume()
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(3)

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(4)
  }

  it('basic pause/resume', async () => {
    await exec(useIntervalFn(callback, 50))

    callback = vi.fn()

    const interval = ref(50)
    await exec(useIntervalFn(callback, interval))

    callback.mockClear()
    interval.value = 20
    await promiseTimeout(30)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume with immediateCallback', async () => {
    await execImmediateCallback(useIntervalFn(callback, 50, { immediateCallback: true }))

    callback = vi.fn()

    const interval = ref(50)
    await execImmediateCallback(useIntervalFn(callback, interval, { immediateCallback: true }))

    callback.mockClear()
    interval.value = 20
    await nextTick()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume in scope', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      await exec(useIntervalFn(callback, 50))
    })
    callback.mockClear()
    await scope.stop()
    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useIntervalFn(callback, -1)

    expect(isActive.value).toBeFalsy()
    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
