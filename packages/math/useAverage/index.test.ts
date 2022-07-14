import { ref } from 'vue-demi'
import { useAverage } from '.'

describe('useAverage', () => {
  it('should be defined', () => {
    expect(useAverage).toBeDefined()
  })

  it('should be the average', () => {
    const arr = ref([1, 2, 3])

    const v = useAverage(arr)

    expect(v.value).toBe(2)

    arr.value = [4, 5, 6]
    expect(v.value).toBe(5)
  })

  it('should be the average when some are ref', () => {
    const a = ref(2)
    const arr = ref([1, a, 9])

    const v = useAverage(arr)

    expect(v.value).toBe(4)

    a.value = 8
    expect(v.value).toBe(6)
  })

  it('should be the average when some items are getter', () => {
    const a = ref(1)
    const arr = ref([1, () => a.value + 1, 9])

    const v = useAverage(arr)

    expect(v.value).toBe(4)

    a.value = 7
    expect(v.value).toBe(6)
  })

  it('should be the average when the array is a getter', () => {
    const arr = ref([1, 2, 3])
    const last = ref(0)

    const v = useAverage(() => arr.value.concat(last.value))

    expect(v.value).toBe(1.5)

    last.value = 10
    expect(v.value).toBe(4)
  })

  it('should work with rest', () => {
    const a = ref(1)
    const b = ref(2)
    const sum = useAverage(a, () => b.value, 3)
    expect(sum.value).toBe(2)
    b.value = 11
    expect(sum.value).toBe(5)
    a.value = 10
    expect(sum.value).toBe(8)
  })
})
