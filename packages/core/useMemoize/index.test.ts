import type { Mock } from 'vitest'
import { computed } from 'vue-demi'
import type { UseMemoizeCache } from '.'
import { useMemoize } from '.'

describe('useMemoize', () => {
  const resolver = vitest.fn()

  beforeEach(() => {
    resolver.mockReset()
    resolver.mockImplementation((arg1: number) => `result-${arg1}`)
  })

  it('should be defined', () => {
    expect(useMemoize).toBeDefined()
  })

  describe('get', () => {
    it('should load and cache data on get', () => {
      const memo = useMemoize(resolver)

      expect(memo(1)).toBe('result-1')
      expect(resolver).toHaveBeenCalledTimes(1)
      expect(resolver).toHaveBeenCalledWith(1)

      resolver.mockClear()
      expect(memo(1)).toBe('result-1')
      expect(resolver).not.toHaveBeenCalled()
    })

    it('should load and cache data with different keys', () => {
      const memo = useMemoize(resolver)

      expect(memo(1)).toBe('result-1')
      expect(memo(2)).toBe('result-2')

      expect(resolver).toHaveBeenCalledTimes(2)
      expect(resolver).toHaveBeenNthCalledWith(1, 1)
      expect(resolver).toHaveBeenNthCalledWith(2, 2)

      resolver.mockClear()
      expect(memo(1)).toBe('result-1')
      expect(memo(2)).toBe('result-2')
      expect(resolver).not.toHaveBeenCalled()
    })

    it('should cache without arguments', () => {
      const _resolver = vitest.fn(() => 'result')
      const memo = useMemoize(_resolver)

      expect(memo()).toBe('result')
      expect(memo()).toBe('result')
      expect(_resolver).toHaveBeenCalledTimes(1)
    })

    it('should cache with multiple arguments', () => {
      const _resolver = vitest.fn((arg1: number, arg2: number) => `result-${arg1}-${arg2}`)
      const memo = useMemoize(_resolver)

      expect(memo(1, 1)).toBe('result-1-1')
      expect(memo(1, 2)).toBe('result-1-2')
      expect(_resolver).toHaveBeenCalledTimes(2)
      expect(_resolver).toHaveBeenNthCalledWith(1, 1, 1)
      expect(_resolver).toHaveBeenNthCalledWith(2, 1, 2)

      _resolver.mockClear()
      expect(memo(1, 1)).toBe('result-1-1')
      expect(memo(1, 2)).toBe('result-1-2')
      expect(_resolver).not.toHaveBeenCalled()
    })
  })

  describe('load', () => {
    it('should always call resolver on load', () => {
      const memo = useMemoize(resolver)

      expect(memo(1)).toBe('result-1')
      expect(memo.load(1)).toBe('result-1')
      expect(resolver).toHaveBeenCalledTimes(2)
      expect(resolver).toHaveBeenNthCalledWith(1, 1)
      expect(resolver).toHaveBeenNthCalledWith(2, 1)

      resolver.mockClear()
      expect(memo(1)).toBe('result-1')
      expect(resolver).not.toHaveBeenCalled()
    })

    it('should reactive update previous get calls', () => {
      const memo = useMemoize(resolver)

      const value1 = computed(() => memo(1))
      expect(value1.value).toBe('result-1')
      expect(resolver).toHaveBeenCalledTimes(1)

      resolver.mockReset()
      resolver.mockImplementation((arg1: number) => `new-result-${arg1}`)

      expect(memo(1)).toBe('result-1')
      expect(resolver).not.toHaveBeenCalled()

      expect(memo.load(1)).toBe('new-result-1')
      expect(resolver).toHaveBeenCalledTimes(1)

      expect(value1.value).toBe('new-result-1')
    })
  })

  describe('delete', () => {
    it('should delete key from cache', () => {
      const memo = useMemoize(resolver)

      expect(memo(1)).toBe('result-1')
      expect(memo(2)).toBe('result-2')
      expect(resolver).toHaveBeenCalledTimes(2)

      resolver.mockClear()
      memo.delete(1)

      expect(memo(1)).toBe('result-1')
      expect(resolver).toHaveBeenCalledTimes(1)
      expect(resolver).toHaveBeenNthCalledWith(1, 1)

      resolver.mockClear()
      expect(memo(2)).toBe('result-2')
      expect(resolver).not.toHaveBeenCalled()
    })
  })

  describe('clear', () => {
    it('should clear all keys from cache', () => {
      const memo = useMemoize(resolver)

      expect(memo(1)).toBe('result-1')
      expect(memo(2)).toBe('result-2')
      expect(resolver).toHaveBeenCalledTimes(2)

      resolver.mockClear()
      memo.clear()

      expect(memo(1)).toBe('result-1')
      expect(memo(2)).toBe('result-2')
      expect(resolver).toHaveBeenCalledTimes(2)
      expect(resolver).toHaveBeenNthCalledWith(1, 1)
      expect(resolver).toHaveBeenNthCalledWith(2, 2)
    })
  })

  describe('options', () => {
    describe('getKey', () => {
      it('should use custom key', () => {
        const getKey = vitest.fn((arg1: number) => arg1 % 2) as any
        const memo = useMemoize(resolver, { getKey })

        expect(memo(1)).toBe('result-1')
        expect(memo(2)).toBe('result-2')
        expect(resolver).toHaveBeenCalledTimes(2)
        expect(resolver).toHaveBeenNthCalledWith(1, 1)
        expect(resolver).toHaveBeenNthCalledWith(2, 2)

        resolver.mockClear()
        expect(memo(3)).toBe('result-1')
        expect(memo('4')).toBe('result-2')
        expect(resolver).not.toHaveBeenCalled()
      })
    })

    describe('cache', () => {
      let cache: UseMemoizeCache<string, string>
      const serializedKey = JSON.stringify([1])

      beforeEach(() => {
        cache = {
          get: vitest.fn(key => key),
          set: vitest.fn(),
          has: vitest.fn(() => true),
          delete: vitest.fn(),
          clear: vitest.fn(),
        }
      })

      it('should use given cache on get', () => {
        const memo = useMemoize(resolver, { cache })

        expect(memo(1)).toBe(serializedKey)
        expect(cache.get).toHaveBeenCalledTimes(1)
        expect(cache.get).toHaveBeenCalledWith(serializedKey)
        expect(cache.has).toHaveBeenCalledTimes(1)
        expect(cache.has).toHaveBeenCalledWith(serializedKey)

        expect(cache.set).not.toHaveBeenCalled()
      })

      it('should use given cache on get without cache', () => {
        const memo = useMemoize(resolver, { cache });
        (cache.has as Mock<any>).mockReturnValue(false)

        expect(memo(1)).toBe(serializedKey)
        expect(cache.has).toHaveBeenCalledTimes(1)
        expect(cache.has).toHaveBeenCalledWith(serializedKey)
        expect(cache.set).toHaveBeenCalledTimes(1)
        expect(cache.set).toHaveBeenCalledWith(serializedKey, 'result-1')
        expect(cache.get).toHaveBeenCalledTimes(1)
        expect(cache.get).toHaveBeenCalledWith(serializedKey)
      })

      it('should use given cache on load', () => {
        const memo = useMemoize(resolver, { cache })

        expect(memo.load(1)).toBe(serializedKey)
        expect(cache.set).toHaveBeenCalledTimes(1)
        expect(cache.set).toHaveBeenCalledWith(serializedKey, 'result-1')
        expect(cache.get).toHaveBeenCalledTimes(1)
        expect(cache.get).toHaveBeenCalledWith(serializedKey)
      })

      it('should use given cache on delete', () => {
        const memo = useMemoize(resolver, { cache })

        memo.delete(1)
        expect(cache.delete).toHaveBeenCalledTimes(1)
        expect(cache.delete).toHaveBeenCalledWith(serializedKey)
      })

      it('should use given cache on clear', () => {
        const memo = useMemoize(resolver, { cache })

        memo.clear()
        expect(cache.clear).toHaveBeenCalledTimes(1)
      })
    })
  })
})
