import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { usePrecision } from './index'

describe('usePrecision', () => {
  it('should be defined', () => {
    expect(usePrecision).toBeDefined()
  })

  it('should work', () => {
    const base = deepRef(45.125)
    const result = usePrecision(base, 2)
    expect(result.value).toBe(45.13)
    base.value = -45.155
    expect(result.value).toBe(-45.15)
  })

  it('out ceil should work', () => {
    const base = deepRef(45.125)
    const result = usePrecision(base, 2, { math: 'ceil' })
    expect(result.value).toMatchInlineSnapshot('45.13')
    base.value = -45.151
    expect(result.value).toMatchInlineSnapshot('-45.15')
  })

  it('out floor should work', () => {
    const base = deepRef(45.129)
    const result = usePrecision(base, 2, { math: 'floor' })
    expect(result.value).toMatchInlineSnapshot('45.12')
    base.value = -45.159
    expect(result.value).toMatchInlineSnapshot('-45.16')
    base.value = 2.3
    expect(result.value).toMatchInlineSnapshot('2.3')
    base.value = -2.3
    expect(result.value).toMatchInlineSnapshot('-2.3')
  })
})
