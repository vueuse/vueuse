import { ref } from 'vue-demi'
import { useArrayLength } from './index'

describe('useArrayLength', () => {
  it('should be defined', () => {
    expect(useArrayLength).toBeDefined()
  })
  it('should work', () => {
    const list = ref([1, 2, 3])
    const length = useArrayLength(list)
    expect(length.value).toBe(3)
    list.value.push(4)
    expect(length.value).toBe(4)
    list.value.pop()
    expect(length.value).toBe(3)
  })
})
