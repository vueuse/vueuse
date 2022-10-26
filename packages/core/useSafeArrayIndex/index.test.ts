import { ref } from 'vue'
import { useSafeArrayIndex } from '.'

describe('useSafeArrayIndex', () => {
  const arr = ref([1, 2, 3])

  it('should be defined', () => {
    expect(useSafeArrayIndex).toBeDefined()
  })

  it('initinal value should be 0', () => {
    const index = useSafeArrayIndex(arr)
    expect(index.value).toBe(0)
  })

  it('initinal index', () => {
    const index = useSafeArrayIndex(arr, 1)
    expect(index.value).toBe(1)
  })

  it('should be clamp', () => {
    const index = useSafeArrayIndex(arr, -1)
    expect(index.value).toBe(0)

    index.value = 999
    expect(index.value).toBe(2)

    arr.value.push(4)
    index.value = 999
    expect(index.value).toBe(3)

    arr.value.splice(0, 1)
    index.value = 999
    expect(index.value).toBe(2)

    arr.value.length = 0
    expect(index.value).toBe(0)
  })
})
