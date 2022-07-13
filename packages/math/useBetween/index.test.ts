import { ref } from 'vue-demi'
import { useBetween } from '.'

describe('useBetween', () => {
  it('should be defined', () => {
    expect(useBetween).toBeDefined()
  })

  it('should be true', () => {
    const result = useBetween(ref(1), ref(0), ref(2))
    expect(result.value).toBe(true)
  })

  it('should be false', () => {
    const val = ref(0)

    const result = useBetween(val, ref(0), ref(2))
    expect(result.value).toBe(false)

    val.value = 2
    expect(result.value).toBe(false)
  })
})
