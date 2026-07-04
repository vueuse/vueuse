import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useRandom } from './index'

describe('useRandom', () => {
  it('should be defined', () => {
    expect(useRandom).toBeDefined()
  })

  it('should return random int between two numbers', () => {
    const min = shallowRef(1)
    const max = shallowRef(10)
    const randomInt = useRandom(min, max)

    // Test multiple times to ensure it's within range
    for (let i = 0; i < 100; i++) {
      const value = randomInt.value
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
      expect(Number.isInteger(value)).toBe(true)
    }
  })

  it('should handle reversed min/max', () => {
    const randomInt = useRandom(10, 1)

    for (let i = 0; i < 50; i++) {
      const value = randomInt.value
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    }
  })

  it('should randomly pick from multiple values', () => {
    const array = deepRef([5, 10, 15, 20, 25])
    const randomInt = useRandom(array)

    // Collect results to verify randomness
    const results = new Set()
    for (let i = 0; i < 100; i++) {
      const value = randomInt.value
      results.add(value)
      expect([5, 10, 15, 20, 25]).toContain(value)
    }

    // Should get multiple different values (not guaranteed but highly likely)
    expect(results.size).toBeGreaterThan(1)
  })

  it('rest usage - multiple values', () => {
    const a = shallowRef(1)
    const b = shallowRef(5)
    const randomInt = useRandom(a, () => b.value, 10, 15)

    for (let i = 0; i < 50; i++) {
      const value = randomInt.value
      expect([1, 5, 10, 15]).toContain(value)
    }

    b.value = 7
    for (let i = 0; i < 50; i++) {
      const value = randomInt.value
      expect([1, 7, 10, 15]).toContain(value)
    }
  })

  it('should update when refs change', () => {
    const min = shallowRef(1)
    const max = shallowRef(5)
    const randomInt = useRandom(min, max)

    // First range
    for (let i = 0; i < 20; i++) {
      const value = randomInt.value
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(5)
    }

    // Change range
    min.value = 10
    max.value = 20

    for (let i = 0; i < 20; i++) {
      const value = randomInt.value
      expect(value).toBeGreaterThanOrEqual(10)
      expect(value).toBeLessThanOrEqual(20)
    }
  })

  it('should handle single value', () => {
    const randomInt = useRandom(42)
    expect(randomInt.value).toBe(42)
  })

  it('should handle empty array', () => {
    const array = deepRef([])
    const randomInt = useRandom(array)
    expect(randomInt.value).toBe(0)
  })
})
