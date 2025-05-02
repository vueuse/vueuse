import { describe, expect, it } from 'vitest'
import { shallowRef, toValue } from 'vue'
import { logicNot } from './index'

describe('logicNot', () => {
  it('should be defined', () => {
    expect(logicNot).toBeDefined()
  })

  it('returns the logical complement of the given ref', () => {
    expect(toValue(logicNot(shallowRef(true)))).toBe(false)
    expect(toValue(logicNot(shallowRef('foo')))).toBe(false)
    expect(toValue(logicNot(shallowRef(1)))).toBe(false)

    expect(toValue(logicNot(shallowRef(false)))).toBe(true)
    expect(toValue(logicNot(shallowRef('')))).toBe(true)
    expect(toValue(logicNot(shallowRef(0)))).toBe(true)
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
