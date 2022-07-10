import { ref } from 'vue-demi'
import { useSum } from '.'

describe('useSum', () => {
  it('should be defined', () => {
    expect(useSum).toBeDefined()
  })
  it('should work', () => {
    const nums = ref([1, 2, 3, 4])
    const sum = useSum(nums)
    expect(sum.value).toBe(10)
    nums.value = [-1, -2, 3, 4]
    expect(sum.value).toBe(4)
  })
})
