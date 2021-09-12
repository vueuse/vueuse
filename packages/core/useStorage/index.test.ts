import { debounceFilter, promiseTimeout } from '@vueuse/shared'
import { nextTick, ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useStorage } from '.'

const KEY = 'custom-key'

describe('useStorage', () => {
  afterEach(() => {
    localStorage.clear()
    // @ts-expect-error
    localStorage.setItem.mockClear()
    // @ts-expect-error
    localStorage.getItem.mockClear()
    // @ts-expect-error
    localStorage.removeItem.mockClear()
  })

  it('string', async() => {
    const instance = useSetup(() => {
      const ref = useStorage(KEY, 'a')

      return {
        ref,
      }
    })

    expect(instance.ref).toBe('a')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'a')

    instance.ref = 'b'
    await nextTick()

    expect(instance.ref).toBe('b')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
  })

  it('number', async() => {
    localStorage.setItem(KEY, '0')

    const instance = useSetup(() => {
      const ref = useStorage(KEY, 1, localStorage)

      return {
        ref,
      }
    })

    expect(instance.ref).toBe(0)

    instance.ref = 2
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '2')

    instance.ref = -1
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '-1')

    instance.ref = 2.3
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '2.3')
  })

  it('boolean', async() => {
    localStorage.removeItem(KEY)

    const instance = useSetup(() => {
      const ref = useStorage(KEY, true, localStorage)

      return {
        ref,
      }
    })

    expect(instance.ref).toBe(true)

    instance.ref = false
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, 'false')

    instance.ref = true
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, 'true')
  })

  it('null string', () => {
    localStorage.setItem(KEY, 'null')

    useSetup(() => {
      const ref = useStorage(KEY, null)
      const storedValue = localStorage.getItem(KEY)

      expect(ref.value).toBe('null')
      expect(storedValue).toBe('null')
    })
  })

  it('null value', () => {
    localStorage.removeItem(KEY)

    useSetup(() => {
      const ref = useStorage(KEY, null)
      const storedValue = localStorage.getItem(KEY)

      expect(ref.value).toBe(null)
      expect(storedValue).toBeFalsy()
    })
  })

  it('remove value', () => {
    localStorage.setItem(KEY, 'null')

    useSetup(() => {
      const ref = useStorage(KEY, null)
      ref.value = null
      const storedValue = localStorage.getItem(KEY)

      expect(ref.value).toBe(null)
      expect(storedValue).toBeFalsy()
    })
  })

  it('string', async() => {
    localStorage.setItem(KEY, '0')

    const instance = useSetup(() => {
      const ref = useStorage(KEY, '1', localStorage)

      expect(ref.value).toBe('0')

      return {
        ref,
      }
    })

    instance.ref = '2'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '2')
  })

  it('object', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const ref = useStorage(KEY, {
      name: 'a',
      data: 123,
    })

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    expect(ref.value).toEqual({
      name: 'a',
      data: 123,
    })

    ref.value.name = 'b'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    ref.value.data = 321
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    ref.value = null
    await nextTick()

    expect(localStorage.removeItem).toBeCalledWith(KEY)
  })

  it('pass ref as initialValue', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const init = ref({
      name: 'a',
      data: 123,
    })
    const storage = useStorage(KEY, init)

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    expect(storage).toBe(init)

    init.value.name = 'b'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')
  })

  it('eventFilter', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const instance = useSetup(() => {
      const ref = useStorage(
        KEY,
        {
          name: 'a',
          data: 123,
        },
        localStorage,
        {
          eventFilter: debounceFilter(100),
        },
      )

      // set on empty storage
      expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

      expect(ref.value).toEqual({
        name: 'a',
        data: 123,
      })

      return {
        ref,
      }
    })

    await nextTick()
    await promiseTimeout(300)
    // @ts-expect-error
    localStorage.setItem.mockClear()

    instance.ref.name = 'b'
    await nextTick()
    expect(localStorage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    // @ts-expect-error
    localStorage.setItem.mockClear()

    instance.ref.data = 321
    await nextTick()
    expect(localStorage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')
  })

  it('custom serializer', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const instance = useSetup(() => {
      const ref = useStorage(KEY, 0, localStorage, { serializer: { read: JSON.parse, write: JSON.stringify } })

      expect(localStorage.setItem).toBeCalledWith(KEY, '0')

      expect(ref.value).toBe(0)

      return {
        ref,
      }
    })

    instance.ref = { name: 'a', data: 123 }
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    instance.ref.name = 'b'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    instance.ref.data = 321
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    instance.ref = null
    await nextTick()

    expect(localStorage.removeItem).toBeCalledWith(KEY)
  })
})
