import { isVue2, isVue3, reactive, ref, set } from 'vue-demi'
import { useSum } from '.'

describe('useSum', () => {
  it('should be defined', () => {
    expect(useSum).toBeDefined()
  })

  it('this should work', () => {
    const value1 = ref(10)
    const value2 = reactive({ a: 20 })

    const sum = useSum([value1, () => value2.a])

    expect(sum.value).toBe(30)

    value1.value = 20
    expect(sum.value).toBe(40)

    value2.a = 30
    expect(sum.value).toBe(50)
  })

  if (isVue3) {
    it('reactive list', async () => {
      const list = reactive([10, 20])

      const sum = useSum(list)
      expect(sum.value).toBe(30)

      list[0] = 21
      expect(sum.value).toBe(41)

      list.push(5)
      expect(sum.value).toBe(46)
    })
  }

  it('getter list', async () => {
    const obj = reactive({ list: [10, 20] })

    const sum = useSum(() => obj.list)
    expect(sum.value).toBe(30)

    if (isVue2)
      set(obj.list, 0, 21)
    else
      obj.list[0] = 21
    expect(sum.value).toBe(41)

    obj.list.push(5)
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
