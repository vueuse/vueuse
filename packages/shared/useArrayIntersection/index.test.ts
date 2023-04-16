import { ref } from 'vue-demi'
import { useArrayIntersection } from './index'

describe('useArrayIntersection', () => {
  it('should be defined', () => {
    expect(useArrayIntersection).toBeDefined()
  })

  it('should return the intersection of two arrays with reactive values', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const item3 = ref(3)
    const item4 = ref(4)
    const item5 = ref(5)

    const list1 = ref([item1, item2, item3, item4, item5])
    const list2 = ref([item4, item5, item3])

    const result = useArrayIntersection(list1, list2)
    expect(result.value).toEqual([3, 4, 5])

    list2.value = [item1, item2]
    expect(result.value).toEqual([1, 2])

    list1.value = [item2, item3]
    expect(result.value).toEqual([2])
  })

  it('should return the intersection of two reactive arrays', () => {
    const list1 = ref([1, 2, 3, 4, 5])
    const list2 = ref([4, 5, 6])

    const result = useArrayIntersection(list1, list2)
    expect(result.value).toEqual([4, 5])

    list2.value = [1, 2, 3]
    expect(result.value).toEqual([1, 2, 3])

    list1.value = [2, 3]
    expect(result.value).toEqual([2, 3])
  })

  it('should return the intersection of two array with comparator function', () => {
    const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = ref([{ id: 4 }, { id: 5 }])

    const result = useArrayIntersection(list1, list2, (value, othVal) => value.id === othVal.id)
    expect(result.value).toEqual([{ id: 4 }, { id: 5 }])

    list2.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }])

    list1.value = [{ id: 2 }, { id: 3 }]
    expect(result.value).toEqual([{ id: 2 }])
  })

  // key
  it('should return the intersection of two array with key', () => {
    const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = ref([{ id: 3 }, { id: 4 }, { id: 5 }])

    const result = useArrayIntersection(list1, list2, 'id')
    expect(result.value).toEqual([{ id: 3 }, { id: 4 }, { id: 5 }])

    list2.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }])

    list1.value = [{ id: 2 }]
    expect(result.value).toEqual([{ id: 2 }])
  })
})
