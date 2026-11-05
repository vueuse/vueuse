import { describe, expect, it, vi } from 'vitest'
import { ref as deepRef, isShallow, shallowRef } from 'vue'
import { nextTwoTick } from '../../.test'
import { useCached } from './index'

function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false
  }
  return true
}

describe('useCached', () => {
  it('should be defined', () => {
    expect(useCached).toBeDefined()
  })

  it('should work with default comparator', async () => {
    const booleanRef = shallowRef(true)

    const cachedBooleanRef = useCached(booleanRef)
    await nextTwoTick()

    expect(cachedBooleanRef.value).toBe(booleanRef.value)

    booleanRef.value = false
    await nextTwoTick()

    expect(cachedBooleanRef.value).toBe(booleanRef.value)
  })

  it('should work with custom comparator', async () => {
    const arrayRef = deepRef([1])
    const initialArrayValue = arrayRef.value

    const cachedArrayRef = useCached(arrayRef, arrayEquals)
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = initialArrayValue
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = [1]
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = [2]
    await nextTwoTick()

    expect(cachedArrayRef.value).not.toBe(initialArrayValue)
    expect(cachedArrayRef.value).toEqual([2])
  })

  it('should pass new value first and keep cache when comparator returns true', async () => {
    const source = shallowRef(0)
    const comparator = vi.fn(() => true)
    const cached = useCached(source, comparator)

    await nextTwoTick()

    source.value = 1
    await nextTwoTick()

    expect(comparator).toHaveBeenCalledWith(1, 0)
    expect(cached.value).toBe(0)
  })

  it('should pass latest cached value on subsequent comparator calls', async () => {
    const source = shallowRef(0)
    const comparator = vi.fn((newValue: number, cachedValue: number) => newValue === cachedValue)
    const cached = useCached(source, comparator)

    await nextTwoTick()

    source.value = 1
    await nextTwoTick()

    source.value = 2
    await nextTwoTick()

    expect(comparator).toHaveBeenNthCalledWith(1, 1, 0)
    expect(comparator).toHaveBeenNthCalledWith(2, 2, 1)
    expect(cached.value).toBe(2)
  })

  describe('should work with options.deepRefs', () => {
    // todo: change default with next major
    it.fails('should return shallowRef by default', () => {
      const value = deepRef(1)

      const cachedValue = useCached(value, vi.fn())
      expect(isShallow(cachedValue)).toBe(true)
    })

    it('should return deepRef if true', () => {
      const value = deepRef(1)

      const cachedValue = useCached(value, vi.fn(), { deepRefs: true })
      expect(isShallow(cachedValue)).toBe(false)
    })

    it('should return shallowRef if false', () => {
      const value = deepRef(1)

      const cachedValue = useCached(value, vi.fn(), { deepRefs: false })
      expect(isShallow(cachedValue)).toBe(true)
    })
  })
})
