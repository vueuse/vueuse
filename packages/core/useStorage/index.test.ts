import { debounceFilter, promiseTimeout } from '@vueuse/shared'
import { isVue3, ref } from 'vue-demi'
import { nextTwoTick, useSetup } from '../../.test'
import { StorageSerializers, customStorageEventName, useStorage } from '.'

const KEY = 'custom-key'

vi.mock('../ssr-handlers', () => ({
  getSSRHandler: vi.fn().mockImplementationOnce((_, cb) => () => cb()).mockImplementationOnce(() => () => {
    throw new Error('getDefaultStorage error')
  }),
}))

describe('useStorage', () => {
  console.error = vi.fn()
  const storageState = new Map<string, string | number | undefined>()
  const storageMock = {
    getItem: vi.fn(x => storageState.get(x)),
    setItem: vi.fn((x, v) => storageState.set(x, v)),
    removeItem: vi.fn(x => storageState.delete(x)),
    clear: vi.fn(() => storageState.clear()),
  }
  const storage = storageMock as any as Storage

  beforeEach(() => {
    localStorage.clear()
    storageState.clear()
    storageMock.setItem.mockClear()
    storageMock.getItem.mockClear()
    storageMock.removeItem.mockClear()
  })

  it('export module', () => {
    expect(useStorage).toBeDefined()
    expect(StorageSerializers).toBeDefined()
  })

  it('string', async () => {
    const vm = useSetup(() => {
      const ref = useStorage(KEY, 'a', storage)

      return {
        ref,
      }
    })

    expect(vm.ref).toBe('a')
    expect(storage.setItem).toBeCalledWith(KEY, 'a')

    vm.ref = 'b'
    await nextTwoTick()

    expect(vm.ref).toBe('b')
    expect(storage.setItem).toBeCalledWith(KEY, 'b')
  })

  it('number', async () => {
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

  it('boolean', async () => {
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

  it('remove value', async () => {
    storage.setItem(KEY, 'random')

    const store = useStorage(KEY, null, storage)
    store.value = null

    await nextTwoTick()

    expect(store.value).toBe(null)
    expect(storage.getItem(KEY)).toBeFalsy()
  })

  it('string', async () => {
    storageState.set(KEY, '0')

    const store = useStorage(KEY, '1', storage)
    expect(store.value).toBe('0')

    store.value = '2'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '2')
  })

  it('date', async () => {
    storageState.set(KEY, '2000-01-01T00:00:00.000Z')

    const store = useStorage(KEY, new Date('2000-01-02T00:00:00.000Z'), storage)
    expect(store.value).toEqual(new Date('2000-01-01T00:00:00.000Z'))

    store.value = new Date('2000-01-03T00:00:00.000Z')
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '2000-01-03T00:00:00.000Z')
  })

  it('object', async () => {
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

  it('map', async () => {
    const store = useStorage(KEY, new Map<number, string | number>([
      [1, 'a'],
      [2, 2],
    ]), storage)

    expect(storage.setItem).toBeCalledWith(KEY, '[[1,"a"],[2,2]]')

    expect(store.value).toEqual(new Map<number, string | number>([[1, 'a'], [2, 2]]))

    if (isVue3) {
      store.value.set(1, 'c')
      await nextTwoTick()

      expect(storage.setItem).toBeCalledWith(KEY, '[[1,"c"],[2,2]]')

      store.value.set(2, 3)
      await nextTwoTick()

      expect(storage.setItem).toBeCalledWith(KEY, '[[1,"c"],[2,3]]')

      store.value = null
      await nextTwoTick()

      expect(storage.removeItem).toBeCalledWith(KEY)
    }
  })

  it('set', async () => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const store = useStorage(KEY, new Set<string | number>([1, '2']), storage)

    expect(storage.setItem).toBeCalledWith(KEY, '[1,"2"]')

    expect(store.value).toEqual(new Set<string | number>([1, '2']))

    if (isVue3) {
      store.value.add('1')
      await nextTwoTick()

      expect(storage.setItem).toBeCalledWith(KEY, '[1,"2","1"]')

      store.value.delete(1)
      await nextTwoTick()

      expect(storage.setItem).toBeCalledWith(KEY, '["2","1"]')

      store.value = null
      await nextTwoTick()

      expect(storage.removeItem).toBeCalledWith(KEY)
    }
  })

  it('pass ref as initialValue', async () => {
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

  it('eventFilter', async () => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const vm = useSetup(() => {
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

    vm.ref.name = 'b'
    await nextTwoTick()
    expect(storage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    // @ts-expect-error mock
    storage.setItem.mockClear()

    vm.ref.data = 321
    await nextTwoTick()
    expect(storage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')
  })

  it('custom serializer', async () => {
    expect(storage.getItem(KEY)).toEqual(undefined)

    const vm = useSetup(() => {
      const ref = useStorage(KEY, 0, storage, { serializer: { read: JSON.parse, write: JSON.stringify } })

      expect(storage.setItem).toBeCalledWith(KEY, '0')

      expect(ref.value).toBe(0)

      return {
        ref,
      }
    })

    vm.ref = { name: 'a', data: 123 }
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    vm.ref.name = 'b'
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    vm.ref.data = 321
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    vm.ref = null
    await nextTwoTick()

    expect(storage.removeItem).toBeCalledWith(KEY)
  })

  it('mergeDefaults option', async () => {
    // basic
    storage.setItem(KEY, '0')
    const basicRef = useStorage(KEY, 1, storage, { mergeDefaults: true })
    expect(basicRef.value).toBe(0)

    // object
    storage.setItem(KEY, JSON.stringify({ a: 1 }))
    const objectRef = useStorage(KEY, { a: 2, b: 3 }, storage, { mergeDefaults: true })
    expect(objectRef.value).toEqual({ a: 1, b: 3 })

    // array
    storage.setItem(KEY, JSON.stringify([1]))
    const arrayRef = useStorage(KEY, [2], storage, { mergeDefaults: true })
    expect(arrayRef.value).toEqual([1])

    // custom function
    storage.setItem(KEY, JSON.stringify([{ a: 1 }]))
    const customRef = useStorage(KEY, [{ a: 3 }], storage, { mergeDefaults: (value, initial) => [...initial, ...value] })
    expect(customRef.value).toEqual([{ a: 3 }, { a: 1 }])

    // custom function 2
    storage.setItem(KEY, '1')
    const customRef2 = useStorage(KEY, 2, storage, { mergeDefaults: (value, initial) => value + initial })
    expect(customRef2.value).toEqual(3)
  })

  it('use storage value if present', async () => {
    storageState.set(KEY, 'true')
    expect(useStorage(KEY, false, storage).value).toBe(true)

    storageState.set(KEY, '0')
    expect(useStorage(KEY, 1, storage).value).toBe(0)

    storageState.set(KEY, 0)
    expect(useStorage(KEY, 1, storage).value).toBe(0)

    storageState.set(KEY, JSON.stringify({}))
    expect(useStorage(KEY, { a: 1 }, storage).value).toEqual({})

    storageState.set(KEY, '')
    expect(useStorage(KEY, null, storage).value).toBe('')

    storageState.set(KEY, 'a')
    expect(useStorage(KEY, 'b', storage).value).toBe('a')

    storageState.set(KEY, JSON.stringify([]))
    expect(useStorage(KEY, new Map([[1, 2]]), storage).value).toEqual(new Map([]))

    storageState.set(KEY, JSON.stringify([]))
    expect(useStorage(KEY, new Set([1, 2]), storage).value).toEqual(new Set([]))
  })

  it('support shallow ref', async () => {
    const data = useStorage(KEY, 0, storage, { shallow: true })
    expect(data.value).toBe(0)

    data.value = 1
    await nextTwoTick()
    expect(data.value).toBe(1)
    expect(storage.getItem(KEY)).toBe('1')
  })

  it('watch storage event', async () => {
    const data = useStorage(KEY, 0, localStorage)
    expect(data.value).toBe(0)

    window.dispatchEvent(new StorageEvent('storage'))
    await nextTwoTick()
    expect(data.value).toBe(0)

    data.value = 1
    await nextTwoTick()
    expect(data.value).toBe(1)

    window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage }))
    await nextTwoTick()
    expect(data.value).toBe(0)

    window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage, key: 'unknown', newValue: '1' }))
    await nextTwoTick()
    expect(data.value).toBe(0)

    window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage, key: KEY, newValue: '1' }))
    await nextTwoTick()
    expect(data.value).toBe(1)
  })

  it('emits custom storage events on change', async () => {
    const eventFn = vi.fn()
    const data0 = useStorage(KEY, 0, storage)
    const data1 = useStorage(KEY, 0, storage)
    expect(data0.value).toBe(0)
    expect(data1.value).toBe(0)

    window.addEventListener(customStorageEventName, eventFn, { once: true })

    data0.value = 1
    await nextTwoTick()

    expect(data0.value).toBe(1)
    expect(data1.value).toBe(1)
    expect(eventFn).toHaveBeenCalled()
    const call = eventFn.mock.calls[0] as [CustomEvent]

    expect(call[0].detail.storageArea).toEqual(storage)
    expect(call[0].detail.key).toEqual(KEY)
    expect(call[0].detail.oldValue).toEqual('0')
    expect(call[0].detail.newValue).toEqual('1')
  })

  it('handle error', () => {
    expect(useStorage(KEY, 0).value).toBe(0)
    expect(console.error).toHaveBeenCalledWith(new Error('getDefaultStorage error'))

    const ref = useStorage(KEY, 0, {
      getItem: () => null,
      setItem: () => { throw new Error('write item error') },
    } as any)
    expect(ref.value).toBe(0)
    ref.value = 1
    expect(console.error).toHaveBeenCalledWith(new Error('write item error'))
  })
})
