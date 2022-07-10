import { reactive, ref } from 'vue-demi'
import { useSum } from '.'

describe('useSum', () => {
  test('should be defined', () => {
    expect(useSum).toBeDefined()
  })

  test('this should work', () => {
    const value1 = ref(10)
    const value2 = ref(20)

    const sum = useSum([value1, value2])

    expect(sum.value).toBe(30)

    value1.value = 20
    expect(sum.value).toBe(40)

    value2.value = 30
    expect(sum.value).toBe(50)
  })

  test('reactive list', () => {
    const list = reactive([10, 20])

    const sum = useSum(list)
    expect(sum.value).toBe(30)

    list[0] = 21
    expect(sum.value).toBe(41)

    list.push(5)
    expect(sum.value).toBe(46)
  })
})
