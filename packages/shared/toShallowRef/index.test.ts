import { computed, isReadonly, isRef, isShallow, ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { toShallowRef } from '.'

describe('toShallowRef', () => {
  it('should be defined', () => {
    expect(toShallowRef).toBeDefined()
  })

  it.each(['a', 1, true, null])('should return shallow ref for primitive value "%s"', (value) => {
    const r = toShallowRef(value)

    expect(isRef(r)).toBe(true)
    expect(isShallow(r)).toBe(true)
  })

  it.each([{ a: 1, b: 2 }, [1, 2]])('should return shallow ref for %s', (obj) => {
    const r = toShallowRef(obj)

    expect(isShallow(r)).toBe(true)
    expect(r.value).toStrictEqual(obj)
  })

  it('should pass ref through', () => {
    const testRef = ref(0)

    const r = toShallowRef(testRef)

    expect(r).toBe(testRef)
  })

  it('should pass computed through', () => {
    const testRef = computed(() => 0)

    const r = toShallowRef(testRef)

    expect(r).toBe(testRef)
  })

  it('should return readonly ref for function', () => {
    const r = toShallowRef(() => 1)

    expect(isRef(r)).toBe(true)
    expect(isReadonly(r)).toBe(true)
  })
})
