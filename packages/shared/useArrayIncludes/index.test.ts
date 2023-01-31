import { ref } from 'vue-demi'
import { useArrayIncludes } from './index'

describe('useArrayIncludes', () => {
  it('should be defined', () => {
    expect(useArrayIncludes).toBeDefined()
  })

  it('should work with array of refs', () => {
    const array = ref([0, 2, 4, 6])
    const result = useArrayIncludes(array, 8)
    expect(result.value).toBeFalsy()
    array.value.push(8)
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })
})
