import { describe, expect, it } from 'vitest'
import { isRef, shallowRef } from 'vue'
import { useProjection } from './index'

describe('useProjection', () => {
  it('should be defined', () => {
    expect(useProjection).toBeDefined()
  })

  it('returns a ref', () => {
    expect(isRef(useProjection(shallowRef(5), [0, 10], [0, 100]))).toBe(true)
  })

  it('projects correctly', () => {
    expect(useProjection(5, [0, 10], [0, 100]).value).toBe(50)
    expect(useProjection(3, [0, 10], [0, 100]).value).toBe(30)
    expect(useProjection(4, [0, 44], [0, 132]).value).toBe(12)
  })

  it('is reactive', () => {
    const inputRef = shallowRef(5)
    const projection = useProjection(inputRef, [0, 10], [0, 100])
    expect(isRef(projection)).toBe(true)

    expect(projection.value).toBe(50)

    inputRef.value = 8
    expect(projection.value).toBe(80)

    inputRef.value = 2.3
    expect(projection.value).toBe(23)
  })

  it('works with getter functions', () => {
    expect(useProjection(() => 5, [0, 10], [0, 100]).value).toBe(50)
    expect(useProjection(() => 3, [0, 10], [0, 100]).value).toBe(30)
    expect(useProjection(() => 4, [0, 44], [0, 132]).value).toBe(12)
  })
})
