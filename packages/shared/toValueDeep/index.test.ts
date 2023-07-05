import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue-demi'
import { toValueDeep } from '.'

const compareByValue = (a: unknown, b: unknown) => expect(JSON.stringify(a)).toBe(JSON.stringify(b))

describe('toValueDeep', () => {
  it('should extract value of nested refs', () => {
    const x = ref({ a: ref(1), b: { c: ref(2) } })
    const y = computed(() => [{ a: ref(1) }, { a: ref(2) }])
    const z = [{ a: ref(1) }, { a: ref(2) }]

    const rawX = toValueDeep(x)
    const rawY = toValueDeep(y)
    const rawZ = toValueDeep(z)

    compareByValue(rawX, { a: 1, b: { c: 2 } })
    compareByValue(rawY, [{ a: 1 }, { a: 2 }])
    compareByValue(rawZ, [{ a: 1 }, { a: 2 }])
  })

  it('should extract value for normal refs like `toValue`', () => {
    const x = ref(1)
    const y = ref({ a: 1 })
    const z = ref([1, 2])

    const rawX = toValueDeep(x)
    const rawY = toValueDeep(y)
    const rawZ = toValueDeep(z)

    expect(rawX).toBe(1)
    compareByValue(rawY, { a: 1 })
    compareByValue(rawZ, [1, 2])
  })

  it('it should work for plain values', () => {
    const num = 1
    const obj = { a: 1 }
    const arr = [1, 2]

    const rawNum = toValueDeep(num)
    const rawObj = toValueDeep(obj)
    const rawArr = toValueDeep(arr)

    expect(rawNum).toBe(1)
    compareByValue(rawObj, { a: 1 })
    compareByValue(rawArr, [1, 2])
  })
})
