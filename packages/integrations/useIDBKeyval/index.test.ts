import { promiseTimeout } from '@vueuse/shared'
import { get, set } from 'idb-keyval'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useIDBKeyval } from '.'

const cache = {} as any

vi.mock('idb-keyval', () => ({
  get: (key: string) => Promise.resolve(cache[key]),
  set: vi.fn((key: string, value: any) => new Promise((resolve, reject) => {
    if (value === 'error') {
      reject(new Error('set error'))
      return
    }

    cache[key] = value

    resolve(undefined)
  })),
  update: (key: string, updater: () => any) => new Promise((resolve, reject) => {
    const value = updater()
    if (value === 'error') {
      reject(new Error('update error'))
      return
    }

    cache[key] = value

    resolve(undefined)
  }),
  del: (key: string) => {
    delete cache[key]
  },
}))

const KEY1 = 'vue-use-idb-keyval-1'
const KEY2 = 'vue-use-idb-keyval-2'
const KEY3 = 'vue-use-idb-keyval-3'
const KEY4 = 'vue-use-idb-keyval-4'
describe('useIDBKeyval', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  set(KEY3, 'hello')

  const { data: data1, isReady: isReady1 } = useIDBKeyval(KEY1, { count: 0 })
  const { data: data2, isReady: isReady2 } = useIDBKeyval(KEY2, ['foo', 'bar'])
  const { data: data3, isReady: isReady3 } = useIDBKeyval(KEY3, 'world', { shallow: true })
  const { isReady: isReady4 } = useIDBKeyval(KEY4, 'test')

  it('get/set', async () => {
    expect(data1.value).toEqual({ count: 0 })
    expect(data2.value).toEqual(['foo', 'bar'])
    expect(data3.value).toEqual('hello')

    await promiseTimeout(50)

    expect(await get(KEY1)).toEqual(data1.value)
    expect(await get(KEY2)).toEqual(data2.value)
    expect(await get(KEY3)).toEqual(data3.value)
  })

  it('update', async () => {
    data1.value.count++
    data2.value.push('woo')
    data3.value = 'world'

    await promiseTimeout(50)

    expect(await get(KEY1)).toEqual(data1.value)
    expect(await get(KEY2)).toEqual(data2.value)
    expect(await get(KEY3)).toEqual(data3.value)
  })

  it('del', async () => {
    data1.value = null
    data2.value = null
    data3.value = null

    await promiseTimeout(50)

    expect(await get(KEY1)).toBeUndefined()
    expect(await get(KEY2)).toBeUndefined()
    expect(await get(KEY3)).toBeUndefined()
  })

  it('catch error on update error', async () => {
    data3.value = 'error'

    await promiseTimeout(50)

    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it('catch error on init error', async () => {
    useIDBKeyval('ERROR_KEY', 'error')

    await promiseTimeout(50)

    expect(console.error).toHaveBeenCalledTimes(1)
  })
  it ('isFinished', async () => {
    const { isFinished } = useIDBKeyval(KEY4, 'test')
    expect(isFinished.value).toBe(false)

    await promiseTimeout(50)

    expect(isFinished.value).toBe(true)
  })
  it('writeDefaults false', async () => {
    useIDBKeyval(KEY4, 'test', { writeDefaults: false })

    await promiseTimeout(50)

    expect(set).toHaveBeenCalledTimes(0)
  })

  it('isReady resolves when data is loaded', async () => {
    // 验证 isReady 方法是否按预期工作
    await expect(isReady1()).resolves.toBeUndefined()
    await expect(isReady2()).resolves.toBeUndefined()
    await expect(isReady3()).resolves.toBeUndefined()

    // 特别检查之前没有初始化数据的 KEY4
    await expect(isReady4()).resolves.toBeUndefined()

    // 进一步验证数据是否正确加载
    expect(await get(KEY1)).toEqual({ count: 0 })
    expect(await get(KEY2)).toEqual(['foo', 'bar'])
    expect(await get(KEY3)).toEqual('hello')
    expect(await get(KEY4)).toEqual('test')
  })
})
