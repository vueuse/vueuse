import { renderHook } from '../../_docs/tests'
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

  it('string', () => {
    renderHook(() => {
      const ref = useStorage(KEY, 'a')

      expect(ref.value).toBe('a')

      expect(localStorage.setItem).toBeCalledWith(KEY, 'a')

      ref.value = 'b'

      expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
    })
  })

  it('number', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStorage(KEY, 1)

      expect(ref.value).toBe(0)

      ref.value = 2

      expect(localStorage.setItem).toBeCalledWith(KEY, '2')

      ref.value = -1

      expect(localStorage.setItem).toBeCalledWith(KEY, '-1')

      ref.value = 2.3

      expect(localStorage.setItem).toBeCalledWith(KEY, '2.3')
    })
  })

  it('boolean', () => {
    localStorage.removeItem(KEY)

    renderHook(() => {
      const ref = useStorage(KEY, true)

      expect(ref.value).toBe(true)

      ref.value = false

      expect(localStorage.setItem).toBeCalledWith(KEY, 'false')

      ref.value = true

      expect(localStorage.setItem).toBeCalledWith(KEY, 'true')
    })
  })

  it('null', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStorage(KEY, null)

      expect(ref.value).toBe('0')
    })
  })

  it('string', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStorage(KEY, '1')

      expect(ref.value).toBe('0')

      ref.value = '2'

      expect(localStorage.setItem).toBeCalledWith(KEY, '2')
    })
  })

  it('object', () => {
    expect(localStorage.getItem(KEY)).toEqual(undefined)

    renderHook(() => {
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

      expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

      ref.value.data = 321

      expect(localStorage.setItem).toBeCalledWith(KEY, '{"name":"b","data":321}')

      // @ts-ignore
      ref.value = null

      expect(localStorage.removeItem).toBeCalledWith(KEY)
    })
  })
})
