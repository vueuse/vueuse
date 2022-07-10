import { ref } from 'vue-demi'
import { useMin } from '.'

describe('useMin', () => {
  it('should be defined', () => {
    expect(useMin).toBeDefined()
  })
  it('should accept ref array', () => {
    const nums = ref([1, 2, 3, 4])
    const min = useMin(nums)
    expect(min.value).toBe(1)
    nums.value = [-1, -2, 3, 4]
    expect(min.value).toBe(-2)
  })
  it('should accept ref item', () => {
    const num1 = ref(1)
    const num2 = ref(2)
    const num3 = ref(3)
    const min = useMin([num1, num2, num3])
    expect(min.value).toBe(1)
    num3.value = -1
    expect(min.value).toBe(-1)
  })
})
