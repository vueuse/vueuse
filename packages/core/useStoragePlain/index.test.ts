import { renderHook } from '../../_docs/tests'
import { useStoragePlain } from '.'

const KEY = 'key'

describe('useStoragePlain', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('string', () => {
    renderHook(() => {
      const ref = useStoragePlain(KEY, 'a')

      expect(ref.value).toBe('a')

      expect(localStorage.setItem).toBeCalledWith(KEY, 'a')

      ref.value = 'b'

      expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
    })
  })

  it('number', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStoragePlain(KEY, 1)

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
    localStorage.setItem(KEY, 'false')

    renderHook(() => {
      const ref = useStoragePlain(KEY, true)

      expect(ref.value).toBe(false)

      ref.value = true

      expect(localStorage.setItem).toBeCalledWith(KEY, 'true')

      ref.value = false

      expect(localStorage.setItem).toBeCalledWith(KEY, 'false')
    })
  })

  it('null', () => {
    localStorage.setItem(KEY, '0')

    renderHook(() => {
      const ref = useStoragePlain(KEY, null)

      expect(ref.value).toBe('0')
    })
  })
})
