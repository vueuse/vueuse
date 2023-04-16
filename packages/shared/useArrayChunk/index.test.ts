import { ref } from 'vue-demi'
import { useArrayChunk } from '.'

describe('useArrayChunk', () => {
  it('should be defined', () => {
    expect(useArrayChunk).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const item3 = ref(3)
    const item4 = ref(4)
    const item5 = ref(5)
    const item6 = ref(6)
    const item7 = ref(7)
    const item8 = ref(8)
    const item9 = ref(9)
    const item10 = ref(10)
    const list = ref([item1, item2, item3, item4, item5, item6, item7, item8, item9, item10])
    const result = useArrayChunk(list, 3)
    expect(result.value).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
    list.value.push(ref(11))
    expect(result.value).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]])
  })

  it('should work with reactive array', () => {
    const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const result = useArrayChunk(list, 3)
    expect(result.value).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
    list.value.push(11)
    expect(result.value).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]])
  })
})
