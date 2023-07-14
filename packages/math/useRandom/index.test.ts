import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useRandom } from '.'

describe('useRandom', () => {
  it('should be defined', () => {
    expect(useRandom).toBeDefined()
  })
  it('should return more than or equal to min, less than max', () => {
    const min = ref(1)
    const max = ref(10)
    const result = useRandom(min, max)
    expect((result.value >= min.value && result.value < max.value)).toBe(true)
  })
})
