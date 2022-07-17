import { ref } from 'vue-demi'
import { useClamp } from '.'

describe('useClamp', () => {
  it('should be defined', () => {
    expect(useClamp).toBeDefined()
  })

  it('should be initial value', () => {
    const v = useClamp(10, 0, 100)
    expect(v.value).toBe(10)
  })

  it('should be max', () => {
    const value = ref(10)
    const min = ref(0)
    const max = ref(100)

    const v = useClamp(value, min, max)

    expect(v.value).toBe(10)

    v.value = 1000
    expect(v.value).toBe(100)

    max.value = 90
    expect(v.value).toBe(90)

    max.value = 100
    expect(v.value).toBe(90)
  })

  it('should be min', () => {
    const value = ref(10)
    const min = ref(0)
    const max = ref(100)

    const v = useClamp(value, min, max)

    expect(v.value).toBe(10)

    v.value = -10
    expect(v.value).toBe(0)

    min.value = 20
    expect(v.value).toBe(20)

    min.value = -10
    v.value = -100
    expect(v.value).toBe(-10)
  })
})
