import { ref } from 'vue-demi'
import { useMin } from '.'

describe('useMin', () => {
  it('should be defined', () => {
    expect(useMin).toBeDefined()
  })

  it('should accept numbers', () => {
    const v = useMin(50, 100)
    expect(v.value).toBe(50)
  })

  it('should accept refs', () => {
    const value1 = ref(10)
    const value2 = ref(100)
    const value3 = ref(1000)

    const v = useMin(value1, value2, value3)
    expect(v.value).toBe(10)

    value1.value = 8
    expect(v.value).toBe(8)

    value2.value = 7
    expect(v.value).toBe(7)

    value3.value = 6
    expect(v.value).toBe(6)
  })

  it('should accept numbers and refs', () => {
    const value1 = 10
    const value2 = ref(100)

    const v = useMin(50, value1, value2)

    expect(v.value).toBe(10)

    value2.value = 0
    expect(v.value).toBe(0)
  })

  it('should accept single arg', () => {
    const v = useMin(50)
    expect(v.value).toBe(50)
  })

  it('should accept zero arg', () => {
    const v = useMin()
    expect(v.value).toBe(Infinity)
  })
})
