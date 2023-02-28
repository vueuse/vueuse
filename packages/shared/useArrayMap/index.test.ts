import { ref } from 'vue-demi'
import { useArrayMap } from '../useArrayMap'

describe('useArrayMap', () => {
  it('should be defined', () => {
    expect(useArrayMap).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(0)
    const item2 = ref(2)
    const item3 = ref(4)
    const item4 = ref(6)
    const item5 = ref(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayMap(list, i => i * 2)
    expect(result.value).toStrictEqual([0, 4, 8, 12, 16])
    item1.value = 1
    expect(result.value).toStrictEqual([2, 4, 8, 12, 16])
  })

  it('should work with reactive array', () => {
    const list = ref([0, 1, 2, 3, 4])
    const result = useArrayMap(list, i => i * 2)
    expect(result.value).toStrictEqual([0, 2, 4, 6, 8])
    list.value.pop()
    expect(result.value).toStrictEqual([0, 2, 4, 6])
  })

  it('should match the return type of mapper function', () => {
    const list = ref([0, 1, 2, 3])
    const result1 = useArrayMap(list, i => i.toString())
    result1.value.forEach(i => expect(i).toBeTypeOf('string'))

    const result2 = useArrayMap(list, i => ({ value: i }))
    result2.value.forEach((item, idx) => {
      expect(item).toBeTypeOf('object')
      expect(item).toHaveProperty('value', idx)
    })
  })
})
