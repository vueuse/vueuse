import { ref } from 'vue-demi'
import { useMax } from '.'

describe('useClamp', () => {
  it('should be defined', () => {
    expect(useMax).toBeDefined()
  })

  it('should be initial value', () => {
    const v = useMax(10, 100)
    expect(v.value).toBe(10)
  })

  it('should be max', () => {
    const value = ref(10)
    const max = ref(100)

    const v = useMax(value, max)

    expect(v.value).toBe(10)

    v.value = 1000
    expect(v.value).toBe(100)

    max.value = 90
    expect(v.value).toBe(90)

    max.value = 100
    expect(v.value).toBe(90)
  })
})
