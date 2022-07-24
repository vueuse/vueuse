import { ref } from 'vue-demi'
import { useMath } from '.'

describe('useMath', () => {
  it('should be defined', () => {
    expect(useMath).toBeDefined()
  })

  it('should accept numbers', () => {
    const v = useMath('pow', 2, 3)
    expect(v.value).toBe(8)
  })

  it('should accept refs', () => {
    const base = ref(2)
    const exponent = ref(3)
    const result = useMath('pow', base, exponent)

    expect(result.value).toBe(8)

    const num = ref(4)
    const root = useMath('sqrt', num)

    expect(root.value).toBe(2)

    num.value = 16
    expect(root.value).toBe(4)
  })
})
