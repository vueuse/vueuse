import { ref } from 'vue-demi'
import { useMin, useMinimum } from '.'

describe('useClamp', () => {
  it('should be defined', () => {
    expect(useMin).toBeDefined()
    expect(useMinimum).toBeDefined()
  })

  it('should accept numbers', () => {
    const v = useMinimum(0, 100)
    expect(v.value).toBe(100)
  })

  it('should accept refs', () => {
    const value1 = ref(10)
    const value2 = ref(100)
    const value3 = ref(1000)

    const v = useMinimum(0, value1, value2, value3)

    expect(v.value).toBe(10)

    v.value = 1001
    expect(v.value).toBe(10)

    value1.value = 9
    expect(v.value).toBe(9)

    value2.value = 8
    expect(v.value).toBe(8)

    value3.value = 7
    expect(v.value).toBe(7)
  })

  it('should accept numbers and refs', () => {
    const value1 = 10
    const value2 = ref(100)

    const v = useMinimum(0, value1, value2)

    expect(v.value).toBe(10)

    value2.value = 9
    expect(v.value).toBe(9)
  })
})
