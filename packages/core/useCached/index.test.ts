import { ref } from 'vue-demi'
import { nextTwoTick } from '../../.test'
import { useCached } from '.'

function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false
  }
  return true
}

describe('useCached', () => {
  it('should be defined', () => {
    expect(useCached).toBeDefined()
  })

  it('should work with default comparator', async () => {
    const booleanRef = ref(true)

    const cachedBooleanRef = useCached(booleanRef)
    await nextTwoTick()

    expect(cachedBooleanRef.value).toBe(booleanRef.value)

    booleanRef.value = false
    await nextTwoTick()

    expect(cachedBooleanRef.value).toBe(booleanRef.value)
  })

  it('should work with custom comparator', async () => {
    const arrayRef = ref([1])
    const initialArrayValue = arrayRef.value

    const cachedArrayRef = useCached(arrayRef, arrayEquals)
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = initialArrayValue
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = [1]
    await nextTwoTick()

    expect(cachedArrayRef.value).toBe(initialArrayValue)

    arrayRef.value = [2]
    await nextTwoTick()

    expect(cachedArrayRef.value).not.toBe(initialArrayValue)
    expect(cachedArrayRef.value).toEqual([2])
  })
})
