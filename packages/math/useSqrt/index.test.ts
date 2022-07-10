import { ref } from 'vue-demi'
import { useSqrt } from '.'

describe('useSqrt', () => {
  it('should be defined', () => {
    expect(useSqrt).toBeDefined()
  })

  it('should work', () => {
    const value = ref(9)
    const result = useSqrt(value)
    expect(result.value).toBe(3)
  })
})
