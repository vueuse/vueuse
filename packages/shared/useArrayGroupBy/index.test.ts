import { describe, expect, it } from 'vitest'
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
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayGroupBy(list, item => item % 2 === 0 ? 'even' : 'odd')
    expect(result.value).toStrictEqual({ odd: [1, 3, 5], even: [2, 4] })
    item1.value = 6
    expect(result.value).toStrictEqual({ even: [6, 2, 4], odd: [3, 5] })
  })

  it('should work with reactive array', () => {
    const list = ref([1, 2, 3, 4, 5, 6, 7, 8])
    const result = useArrayGroupBy(list, item => item % 2 === 0 ? 'even' : 'odd')
    expect(result.value).toStrictEqual({ odd: [1, 3, 5, 7], even: [2, 4, 6, 8] })
    list.value.push(9)
    expect(result.value).toStrictEqual({ odd: [1, 3, 5, 7, 9], even: [2, 4, 6, 8] })
  })
})
