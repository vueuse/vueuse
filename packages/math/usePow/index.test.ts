import { ref } from 'vue-demi'
import { usePow } from '.'

describe('usePow', () => {
  it('should be defined', () => {
    expect(usePow).toBeDefined()
  })
  it('should work', () => {
    const base = ref(2)
    const exponent = ref(3)
    const result = usePow(base, exponent)
    expect(result.value).toBe(8)
    base.value = 3
    exponent.value = 2
    expect(result.value).toBe(9)
  })
})
