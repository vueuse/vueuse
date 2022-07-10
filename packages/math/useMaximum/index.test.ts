import { ref } from 'vue-demi'
import { useMax, useMaximum } from '.'

describe('useClamp', () => {
  it('should be defined', () => {
    expect(useMax).toBeDefined()
    expect(useMaximum).toBeDefined()
  })

  it('should accept numbers', () => {
    const v = useMaximum(50, 100)
    expect(v.value).toBe(100)
  })

  it('should accept refs', () => {
    const value1 = ref(10)
    const value2 = ref(100)
    const value3 = ref(1000)

    const v = useMaximum(value1, value2, value3)
    expect(v.value).toBe(1000)

    value1.value = 2000
    expect(v.value).toBe(2000)

    value2.value = 2001
    expect(v.value).toBe(2001)

    value3.value = 2002
    expect(v.value).toBe(2002)
  })

  it('should accept numbers and refs', () => {
    const value1 = 10
    const value2 = ref(100)

    const v = useMaximum(50, value1, value2)

    expect(v.value).toBe(100)

    value2.value = 200
    expect(v.value).toBe(200)
  })
})
