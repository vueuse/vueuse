import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { toValue } from '@vueuse/shared'
import { logicNot } from '.'

describe('logicNot', () => {
  it('should be defined', () => {
    expect(logicNot).toBeDefined()
  })

  it('returns the logical complement of the given ref', () => {
    expect(toValue(logicNot(ref(true)))).toBe(false)
    expect(toValue(logicNot(ref('foo')))).toBe(false)
    expect(toValue(logicNot(ref(1)))).toBe(false)

    expect(toValue(logicNot(ref(false)))).toBe(true)
    expect(toValue(logicNot(ref('')))).toBe(true)
    expect(toValue(logicNot(ref(0)))).toBe(true)
  })

  it('returns the logical complement of the given value', () => {
    expect(toValue(logicNot(true))).toBe(false)
    expect(toValue(logicNot('foo'))).toBe(false)

    expect(toValue(logicNot(false))).toBe(true)
    expect(toValue(logicNot(''))).toBe(true)
    expect(toValue(logicNot(0))).toBe(true)
  })

  it('returns the logical complement of the given getter function', () => {
    expect(toValue(logicNot(() => true))).toBe(false)
    expect(toValue(logicNot(() => 'foo'))).toBe(false)

    expect(toValue(logicNot(() => false))).toBe(true)
    expect(toValue(logicNot(() => 0))).toBe(true)
  })
})
