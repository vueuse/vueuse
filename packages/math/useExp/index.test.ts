import { ref } from 'vue-demi'
import { useExp } from '.'

describe('useExp', () => {
  it('should be defined', () => {
    expect(useExp).toBeDefined()
  })

  it('should work', () => {
    const value = ref(1)
    const result = useExp(value)
    expect(result.value).toBe(2.718281828459045)
  })
})
