import { ref } from 'vue-demi'
import { useArraySome } from '../useArraySome'

describe('useArraySome', () => {
  it('should be defined', () => {
    expect(useArraySome).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(0)
    const item2 = ref(2)
    const item3 = ref(4)
    const item4 = ref(6)
    const item5 = ref(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArraySome(list, i => i > 10)
    expect(result.value).toBe(false)
    item1.value = 11
    expect(result.value).toBe(true)
  })

  it('should work with reactive array', () => {
    const list = ref([0, 2, 4, 6, 8])
    const result = useArraySome(list, i => i > 10)
    expect(result.value).toBe(false)
    list.value.push(11)
    expect(result.value).toBe(true)
  })
})
