import { ref } from 'vue-demi'
import { useRound } from '.'

describe('useRound', () => {
  it('should be defined', () => {
    expect(useRound).toBeDefined()
  })
  it('should work', () => {
    const base = ref(45.95)
    const result = useRound(base)
    expect(result.value).toBe(46)
    base.value = -45.05
    expect(result.value).toBe(-45)
  })
})
