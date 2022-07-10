import { isVue2, reactive, ref, set } from 'vue-demi'
import { useSum } from '.'

describe('useSum', () => {
  it('should be defined', () => {
    expect(useSum).toBeDefined()
  })

  it('this should work', () => {
    const value1 = ref(10)
    const value2 = ref(20)

    const sum = useSum([value1, value2])

    expect(sum.value).toBe(30)

    value1.value = 20
    expect(sum.value).toBe(40)

    value2.value = 30
    expect(sum.value).toBe(50)
  })

  it('reactive list', async () => {
    if (isVue2)
      return

    const list = reactive([10, 20])

    const sum = useSum(list)
    expect(sum.value).toBe(30)

    list[0] = 21
    expect(sum.value).toBe(41)

    list.push(5)
    expect(sum.value).toBe(46)
  })

  it('maybe ref list', () => {
    const list = ref([10, 20])

    const sum = useSum(list)
    expect(sum.value).toBe(30)

    if (isVue2)
      set(list.value, 0, 21)
    else
      list.value[0] = 21

    expect(sum.value).toBe(41)

    list.value = [10, 20, 5]
    expect(sum.value).toBe(35)
  })

  it('custom adder and initialValue', () => {
    const value1 = ref({ a: 10 })
    const value2 = ref({ a: 20 })

    const sum = useSum([value1, value2], (sum, val) => sum + val.a, 0)

    expect(sum.value).toBe(30)

    value1.value.a = 20
    expect(sum.value).toBe(40)

    value2.value.a = 30
    expect(sum.value).toBe(50)
  })
})
