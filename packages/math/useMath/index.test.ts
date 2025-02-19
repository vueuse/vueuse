import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { useMath } from './index'

describe('useMath', () => {
  it('should be defined', () => {
    expect(useMath).toBeDefined()
  })

  it('should accept numbers', () => {
    const v = useMath('pow', 2, 3)
    expect(v.value).toBe(8)
  })

  it('should accept refs', () => {
    const base = shallowRef(2)
    const exponent = shallowRef(3)
    const result = useMath('pow', base, exponent)

    expect(result.value).toBe(8)

    const num = shallowRef(4)
    const root = useMath('sqrt', num)

    expect(root.value).toBe(2)

    num.value = 16
    expect(root.value).toBe(4)
  })
})
