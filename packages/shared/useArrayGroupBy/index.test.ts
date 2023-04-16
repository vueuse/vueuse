import { ref } from 'vue-demi'
import { useArrayGroupBy } from '.'

describe('useArrayGroupBy', () => {
  it('should be defined', () => {
    expect(useArrayGroupBy).toBeDefined()
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
    const result = useArrayGroupBy(list, (value) => {
      return value % 2 === 0 ? 'even' : 'odd'
    })

    expect(result.value).toEqual({
      even: [2, 4, 6, 8, 10],
      odd: [1, 3, 5, 7, 9],
    })
  })

  it('should work with reactive array', () => {
    const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const result = useArrayGroupBy(list, (value) => {
      return value % 2 === 0 ? 'even' : 'odd'
    })

    expect(result.value).toEqual({
      even: [2, 4, 6, 8, 10],
      odd: [1, 3, 5, 7, 9],
    })
  })
})
