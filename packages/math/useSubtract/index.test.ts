import { ref } from 'vue'
import { useSubtract } from '../useSubtract'

describe('useSubtract', () => {
  it('should be defined', () => {
    expect(useSubtract).toBeDefined()
  })

  it('should work', () => {
    const a = ref(0.95)
    const b = ref(0.95)
    const result = useSubtract(a, b)
    expect(result.value).toBe(0)
    a.value = 1
    b.value = 2
    expect(result.value).toBe(-1)
  })
})
