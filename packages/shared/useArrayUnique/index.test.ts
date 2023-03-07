import { reactive, ref } from 'vue-demi'
import { useArrayUnique } from '../useArrayUnique'

describe('useArrayUnique', () => {
  it('should be defined', () => {
    expect(useArrayUnique).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(0)
    const item2 = ref(1)
    const item3 = ref(1)
    const item4 = ref(2)
    const item5 = ref(3)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayUnique(list)
    expect(result.value.length).toBe(4)
    item5.value = 2
    expect(result.value.length).toBe(3)
  })

  it('should work with ref array', () => {
    const list = ref([1, 2, 2, 3])
    const result = useArrayUnique(list)
    expect(result.value.length).toBe(3)
    list.value.push(1)
    expect(result.value.length).toBe(3)
  })

  it('should work with reactive array', () => {
    const list = reactive([1, 2, 2, 3])
    const result = useArrayUnique(list)
    expect(result.value.length).toBe(3)
    list.push(1)
    expect(result.value.length).toBe(3)
  })
})
