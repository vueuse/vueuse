import { promiseTimeout } from '@vueuse/shared'
import { get, set } from 'idb-keyval'
import { useIDBKeyval } from '.'

const KEY1 = 'vue-use-idb-keyval-1'
const KEY2 = 'vue-use-idb-keyval-2'
const KEY3 = 'vue-use-idb-keyval-3'
describe('useIDBKeyval', () => {
  beforeEach(() => {
    console.error = vi.fn()
  })

  set(KEY3, 'hello')

  const data1 = useIDBKeyval(KEY1, { count: 0 })
  const data2 = useIDBKeyval(KEY2, ['foo', 'bar'])
  const data3 = useIDBKeyval(KEY3, 'world', { shallow: true })

  it('get/set', async () => {
    expect(data1.value).toEqual({ count: 0 })
    expect(data2.value).toEqual(['foo', 'bar'])
    expect(data3.value).toEqual('world')

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

  it('throw error on update proxy object', async () => {
    // @ts-expect-error mock update proxy
    data1.value = { count: new Proxy({}, {}) }

    await promiseTimeout(100)

    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
