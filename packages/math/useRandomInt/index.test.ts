import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useRandomInt } from '.'

describe('useRandomInt', () => {
  it('should be defined', () => {
    expect(useRandomInt).toBeDefined()
  })
  it('should return more than or equal to min, less than max', () => {
    const min = ref(1)
    const max = ref(10)
    const result = useRandomInt(min, max)
    expect((result.value >= min.value && result.value < max.value)).toBe(true)
    expect(Number.isInteger(result.value)).toBe(true)
  })
})
