import { ref } from 'vue-demi'
import { useMin } from '.'

describe('useMin', () => {
  it('should be defined', () => {
    expect(useMin).toBeDefined()
  })

  it('array usage', () => {
    const array = ref([1, 2, 3, 4])
    const min = useMin(array)
    expect(min.value).toBe(1)
    array.value = [-1, -2, 3, 4]
    expect(min.value).toBe(-2)
  })

  it('rest usage', () => {
    const a = ref(1)
    const b = ref(2)
    const min = useMin(a, () => b.value, 3)
    expect(min.value).toBe(1)
    b.value = -3
    expect(min.value).toBe(-3)
  })
})
