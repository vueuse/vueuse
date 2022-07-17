import { ref } from 'vue-demi'
import { useSum } from '.'

describe('useSum', () => {
  it('should be defined', () => {
    expect(useSum).toBeDefined()
  })

  it('array usage', () => {
    const array = ref([1, 2, 3, 4])
    const sum = useSum(array)
    expect(sum.value).toBe(10)
    array.value = [-1, -2, 3, 4]
    expect(sum.value).toBe(4)
  })

  it('rest usage', () => {
    const a = ref(1)
    const b = ref(2)
    const sum = useSum(a, () => b.value, 3)
    expect(sum.value).toBe(6)
    b.value = 3
    expect(sum.value).toBe(7)
  })
})
