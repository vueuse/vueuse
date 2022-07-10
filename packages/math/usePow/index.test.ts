import { ref } from 'vue-demi'
import { usePow } from '.'

describe('usePow', () => {
  it('should be defined', () => {
    expect(usePow).toBeDefined()
  })
  it('should work', () => {
    const base = ref(2)
    const exponent = ref(2)
    const result = usePow(base, exponent)
    expect(result.value).toBe(4)
    base.value = 4
    expect(result.value).toBe(16)
    exponent.value = 3
    expect(result.value).toBe(64)
  })
})
