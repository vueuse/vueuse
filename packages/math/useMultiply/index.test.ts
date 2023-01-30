import { ref } from 'vue-demi'
import { useMultiply } from './index'

describe('useMultiply', () => {
  it('should be defined', () => {
    expect(useMultiply).toBeDefined()
  })

  it('should work', () => {
    const a = ref(2)
    const b = ref(3)
    const result = useMultiply(a, b)
    expect(result.value).toBe(6)
    a.value = 4
    expect(result.value).toBe(12)
  })
})
