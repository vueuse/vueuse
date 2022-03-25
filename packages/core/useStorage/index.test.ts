import { debounceFilter, promiseTimeout } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { nextTwoTick, useSetup } from '../../.test'
import { useStorage } from '.'

const KEY = 'custom-key'

describe('useStorage', () => {
  const storageState = new Map<string, string | undefined>()
  const storageMock = {
    getItem: vi.fn(x => storageState.get(x)),
    setItem: vi.fn((x, v) => storageState.set(x, v)),
    removeItem: vi.fn(x => storageState.delete(x)),
    clear: vi.fn(() => storageState.clear()),
  }
  const storage = storageMock as any as Storage

  beforeEach(() => {
    storageState.clear()
    storageMock.setItem.mockClear()
    storageMock.getItem.mockClear()
    storageMock.removeItem.mockClear()
  })

  it('string', async() => {
    const instance = useSetup(() => {
      const ref = useStorage(KEY, 'a', storage)

      return {
        ref,
      }
    })

    expect(instance.ref).toBe('a')
    expect(storage.setItem).toBeCalledWith(KEY, 'a')

    instance.ref = 'b'
    await nextTwoTick()

    expect(instance.ref).toBe('b')
    expect(storage.setItem).toBeCalledWith(KEY, 'b')
  })

  it('number', async() => {
    storageState.set(KEY, '0')

    const store = useStorage(KEY, 1, storage)
    expect(store.value).toBe(0)

    store.value = 2
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '2')

    store.value = -1
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '-1')

    store.value = 2.3
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '2.3')
  })

  it('boolean', async() => {
    storage.removeItem(KEY)

    const store = useStorage(KEY, true, storage)

    expect(store.value).toBe(true)

    store.value = false
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, 'false')

    store.value = true
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, 'true')
  })

  it('null string', () => {
    storage.setItem(KEY, 'null')

    const store = useStorage(KEY, null, storage)
    const storedValue = storage.getItem(KEY)

    expect(store.value).toBe('null')
    expect(storedValue).toBe('null')
  })

  it('null value', () => {
    storage.removeItem(KEY)

    const store = useStorage(KEY, null)
    const storedValue = storage.getItem(KEY)

    expect(store.value).toBe(null)
    expect(storedValue).toBeFalsy()
  })

  it('remove value', async() => {
    storage.setItem(KEY, 'null')

    const store = useStorage(KEY, null, storage)
    store.value = null

    await nextTwoTick()

    expect(store.value).toBe(null)
    expect(storage.getItem(KEY)).toBeFalsy()
  })

  it('string', async() => {
    storageState.set(KEY, '0')

    const store = useStorage(KEY, '1', storage)
    expect(store.value).toBe('0')

    store.value = '2'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '2')
  })

  it('object', async() => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const store = useStorage(KEY, {
      name: 'a',
      data: 123,
    }, storage)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    expect(store.value).toEqual({
      name: 'a',
      data: 123,
    })

    store.value.name = 'b'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    store.value.data = 321
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    store.value = null
    await nextTwoTick()

    expect(storage.removeItem).toBeCalledWith(KEY)
  })

  it('pass ref as initialValue', async() => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const init = ref({
      name: 'a',
      data: 123,
    })
    const state = useStorage(KEY, init, storage)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    expect(state).toBe(init)

    init.value.name = 'b'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')
  })

  it('eventFilter', async() => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const instance = useSetup(() => {
      const ref = useStorage(
        KEY,
        {
          name: 'a',
          data: 123,
        },
        storage,
        {
          eventFilter: debounceFilter(100),
        },
      )

      // set on empty storage
      expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

      expect(ref.value).toEqual({
        name: 'a',
        data: 123,
      })

      return {
        ref,
      }
    })

    await nextTwoTick()
    await promiseTimeout(300)
    // @ts-expect-error mock
    storage.setItem.mockClear()

    instance.ref.name = 'b'
    await nextTwoTick()
    expect(storage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    // @ts-expect-error mock
    storage.setItem.mockClear()

    instance.ref.data = 321
    await nextTwoTick()
    expect(storage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')
  })

  it('custom serializer', async() => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const instance = useSetup(() => {
      const ref = useStorage(KEY, 0, storage, { serializer: { read: JSON.parse, write: JSON.stringify } })

      expect(storage.setItem).toBeCalledWith(KEY, '0')

      expect(ref.value).toBe(0)

      return {
        ref,
      }
    })

    instance.ref = { name: 'a', data: 123 }
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    instance.ref.name = 'b'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    instance.ref.data = 321
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    instance.ref = null
    await nextTwoTick()

    expect(storage.removeItem).toBeCalledWith(KEY)
  })
})
