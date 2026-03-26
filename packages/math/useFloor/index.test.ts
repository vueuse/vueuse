import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { useFloor } from './index'

describe('useFloor', () => {
  it('should be defined', () => {
    expect(useFloor).toBeDefined()
  })

  it('should work', () => {
    const base = deepRef(45.95)
    const result = useFloor(base)
    expect(result.value).toBe(45)
    base.value = -45.05
    expect(result.value).toBe(-46)
  })
})
