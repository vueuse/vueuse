import { ref } from 'vue-demi'
import { useRound } from '.'

describe('useRound', () => {
  it('should be defined', () => {
    expect(useRound).toBeDefined()
  })
  it('should work', () => {
    const base = ref(20.49)
    const result = useRound(base)
    expect(result.value).toBe(20)
    base.value = -20.51
    expect(result.value).toBe(-21)
  })
})
