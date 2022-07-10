import { ref } from 'vue-demi'
import { useCeil } from '.'

describe('useCeil', () => {
  it('should be defined', () => {
    expect(useCeil).toBeDefined()
  })
  it('should work', () => {
    const base = ref(0.95)
    const result = useCeil(base)
    expect(result.value).toBe(1)
    base.value = -7.004
    expect(result.value).toBe(-7)
  })
})
