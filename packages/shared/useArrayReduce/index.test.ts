import { isVue2, reactive, ref } from 'vue-demi'
import { useArrayReduce } from '../useArrayReduce'

describe('useArrayReduce', () => {
  it('should be defined', () => {
    expect(useArrayReduce).toBeDefined()
  })

  it('should calculate the array sum', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const sum = useArrayReduce([item1, item2, 3], (a, b) => a + b)
    expect(sum.value).toBe(6)

    item1.value = 4
    expect(sum.value).toBe(9)

    item2.value = 3
    expect(sum.value).toBe(10)
  })

  it.skipIf(isVue2)('should work with reactive array', () => {
    const list = reactive([1, 2])
    const sum = useArrayReduce(list, (a, b) => a + b)
    expect(sum.value).toBe(3)

    list.push(3)
    expect(sum.value).toBe(6)
  })

  it.skipIf(isVue2)('should work with initialValue', () => {
    const list = reactive([{ num: 1 }, { num: 2 }])
    const sum = useArrayReduce(list, (sum, val) => sum + val.num, 0 as number)
    expect(sum.value).toBe(3)

    list.push({ num: 3 })
    expect(sum.value).toBe(6)
  })
})
