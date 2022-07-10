import { ref } from 'vue-demi'
import { useFixed } from '.'

describe('useClamp', () => {
  it('should be defined', () => {
    expect(useFixed).toBeDefined()
  })

  it('should be the fixed value', () => {
    const v = useFixed(4.422, 1)
    expect(v.value).toBe(4.4)
  })

  it('should be 0', () => {
    // it should be 0.00 if you use toFixed function directly, but useFiexed will return 0
    const v = useFixed(0, 2)
    expect(v.value).toBe(0)
  })

  it('should be the fixed value for reactive value', () => {
    const num = ref(3.1415)
    const digits = ref(2)
    const v = useFixed(num, digits)

    expect(v.value).toBe(3.14)

    digits.value = 1
    expect(v.value).toBe(3.1)

    num.value = 9
    expect(v.value).toBe(9)
  })
})
