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

  it('should work with array of refs and comparator', () => {
    const array = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, 3, 'id')
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and comparatorFn', () => {
    const array = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, { id: 3 }, (element, value) => element.id === value.id)
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and fromIndex', () => {
    const array = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, { id: 1 }, { fromIndex: 1, comparator: (element, value) => element.id === value.id })
    expect(result.value).toBeFalsy()
  })
})
