import { ref } from 'vue-demi'
import { useMath } from '.'

describe('useMath', () => {
  it('should be defined', () => {
    expect(useMath).toBeDefined()
  })
  it('should accept max', () => {
    const value1 = ref(10)
    const value2 = ref(20)
    const result = useMath('max', value1, value2)
    expect(result.value).toBe(20)
    value1.value = 30
    expect(result.value).toBe(30)
  })
  it('should accept min', () => {
    const value1 = ref(10)
    const value2 = ref(20)
    const result = useMath('min', value1, value2)
    expect(result.value).toBe(10)
    value2.value = 5
    expect(result.value).toBe(5)
  })
  it('should accept floor', () => {
    const value1 = ref(1.1)
    const result = useMath('floor', value1)
    expect(result.value).toBe(1)
    value1.value = 5.2
    expect(result.value).toBe(5)
  })
  it('should accept round', () => {
    const value1 = ref(4.5)
    const result = useMath('round', value1)
    expect(result.value).toBe(5)
    value1.value = 5.2
    expect(result.value).toBe(5)
  })
})
