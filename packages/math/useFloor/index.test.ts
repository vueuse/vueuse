import { ref } from 'vue-demi'
import { useFloor } from '.'

describe('useFloor', () => {
  it('should be defined', () => {
    expect(useFloor).toBeDefined()
  })
  it('should work', () => {
    const base = ref(45.95)
    const result = useFloor(base)
    expect(result.value).toBe(45)
    base.value = -45.05
    expect(result.value).toBe(-46)
  })
})
