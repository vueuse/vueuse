import { ref } from 'vue-demi'
import { useDivide } from '../useDivide'

describe('useDivide', () => {
  it('should be defined', () => {
    expect(useDivide).toBeDefined()
  })

  it('should work', () => {
    const divide = ref(10)
    const divisor = ref(2)
    const result = useDivide(divide, divisor)
    expect(result.value).toBe(5)
    divide.value = 20
    expect(result.value).toBe(10)
    divisor.value = 0
    expect(result.value).toBe(Infinity)
  })
})
