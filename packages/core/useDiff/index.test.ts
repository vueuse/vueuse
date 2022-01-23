import { ref } from 'vue-demi'
import { nextTwoTick } from '../../.test'
import { useDiff } from '.'

function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false
  }
  return true
}

describe('useDiff', () => {
  it('should be defined', () => {
    expect(useDiff).toBeDefined()
  })

  it('should work', async() => {
    const arrayRef = ref([1])
    const initialArrayValue = arrayRef.value

    const cachedArrayRef = useDiff(arrayRef, arrayEquals)
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
