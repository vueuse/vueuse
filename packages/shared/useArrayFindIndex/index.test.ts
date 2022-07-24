import { ref } from 'vue-demi'
import { useArrayFindIndex } from '.'

describe('useArrayFindIndex', () => {
  it('should be defined', () => {
    expect(useArrayFindIndex).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(0)
    const item2 = ref(2)
    const item3 = ref(4)
    const item4 = ref(6)
    const item5 = ref(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayFindIndex(list, i => i % 2 === 0)
    expect(result.value).toBe(0)
    item1.value = 1
    expect(result.value).toBe(1)
    item2.value = 3
    expect(result.value).toBe(2)
    item3.value = 5
    expect(result.value).toBe(3)
    item4.value = 7
    expect(result.value).toBe(4)
    item5.value = 9
    expect(result.value).toBe(-1)
  })

  it('should work with reactive array', () => {
    const list = ref([0, 2, 4, 6, 8])
    const result = useArrayFindIndex(list, i => i % 2 === 0)
    expect(result.value).toBe(0)
    list.value.unshift(-1)
    expect(result.value).toBe(1)
  })
})
