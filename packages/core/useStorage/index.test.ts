import { debounceFilter, promiseTimeout } from '@vueuse/shared'
import { nextTick } from 'vue-demi'
import { renderHook } from '../../_tests'
import { useStorage } from '.'

const KEY = 'custom-key'

describe('useStorage', () => {
  afterEach(() => {
    localStorage.clear()
    // @ts-ignore
    localStorage.setItem.mockClear()
    // @ts-ignore
    localStorage.getItem.mockClear()
    // @ts-ignore
    localStorage.removeItem.mockClear()
  })

  it('string', async() => {
    const instance = renderHook(() => {
      const ref = useStorage(KEY, 'a')

      return {
        ref,
      }
    }).vm

    expect(instance.ref).toBe('a')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'a')

    instance.ref = 'b'
    await nextTick()

    expect(instance.ref).toBe('b')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
  })

  it('number', async() => {
    localStorage.setItem(KEY, '0')

    const instance = renderHook(() => {
      const ref = useStorage(KEY, 1)

      return {
        ref,
      }
    }).vm

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

    const instance = renderHook(() => {
      const ref = useStorage(KEY, true)

      return {
        ref,
      }
    }).vm

    expect(instance.ref).toBe(true)

    instance.ref = false
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, 'false')

    instance.ref = true
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, 'true')
  })

  it('null', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStorage(KEY, null)

      expect(ref.value).toBe('0')
    })
  })

  it('string', async() => {
    localStorage.setItem(KEY, '0')

    const instance = renderHook(() => {
      const ref = useStorage(KEY, '1')

      expect(ref.value).toBe('0')

      return {
        ref,
      }
    }).vm

    instance.ref = '2'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '2')
  })

  it('object', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const instance = renderHook(() => {
      const ref = useStorage(KEY, {
        name: 'a',
        data: 123,
      })

      expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

      expect(ref.value).toEqual({
        name: 'a',
        data: 123,
      })

      return {
        ref,
      }
    }).vm

    instance.ref.name = 'b'
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    instance.ref.data = 321
    await nextTick()

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

    // @ts-ignore
    instance.ref = null
    await nextTick()

    expect(localStorage.removeItem).toBeCalledWith(KEY)
  })

  it('eventFilter', async() => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    const instance = renderHook(() => {
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
    }).vm

    await nextTick()
    await promiseTimeout(300)
    // @ts-ignore
    localStorage.setItem.mockClear()

    instance.ref.name = 'b'
    await nextTick()
    expect(localStorage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    // @ts-ignore
    localStorage.setItem.mockClear()

    instance.ref.data = 321
    await nextTick()
    expect(localStorage.setItem).not.toBeCalled()
    await promiseTimeout(300)

    expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')
  })
})
