import { ref } from 'vue-demi'
import { useExp } from '.'

describe('useExp', () => {
  it('should be defined', () => {
    expect(useExp).toBeDefined()
  })
  it('should work', () => {
    const base = ref(0)
    const result = useExp(base)
    expect(result.value).toBeCloseTo(1)

    base.value = -1
    expect(result.value).toBeCloseTo(0.36787944117144233)
    base.value = 1
    expect(result.value).toBeCloseTo(Math.E)
    base.value = 2
    expect(result.value).toBeCloseTo(Math.E * Math.E)
  })
})
