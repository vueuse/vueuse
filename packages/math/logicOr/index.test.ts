import { describe, expect, it } from 'vitest'
import { shallowRef, toValue } from 'vue'
import { logicOr } from './index'

describe('logicOr', () => {
  it('should be defined', () => {
    expect(logicOr).toBeDefined()
  })

  it('returns false when given no args', () => {
    expect(toValue(logicOr())).toBe(false)
  })

  it('returns true only when any arguments are truthy', () => {
    expect(toValue(logicOr(shallowRef(true), shallowRef(true)))).toBe(true)
    expect(toValue(logicOr(shallowRef('foo'), shallowRef(false)))).toBe(true)
    expect(toValue(logicOr(shallowRef('foo'), shallowRef(1), shallowRef(false)))).toBe(true)

    expect(toValue(logicOr(shallowRef(false), shallowRef(false)))).toBe(false)
    expect(toValue(logicOr(shallowRef(''), shallowRef(0)))).toBe(false)
  })

  it('works with values', () => {
    expect(toValue(logicOr(true))).toBe(true)
    expect(toValue(logicOr(true, false))).toBe(true)
    expect(toValue(logicOr('foo'))).toBe(true)

    expect(toValue(logicOr(false))).toBe(false)
    expect(toValue(logicOr(''))).toBe(false)
    expect(toValue(logicOr(0))).toBe(false)
  })

  it('works with getter functions', () => {
    expect(toValue(logicOr(() => true))).toBe(true)
    expect(toValue(logicOr(() => true, () => false))).toBe(true)
    expect(toValue(logicOr(() => 'foo'))).toBe(true)

    expect(toValue(logicOr(() => false))).toBe(false)
    expect(toValue(logicOr(() => ''))).toBe(false)
    expect(toValue(logicOr(() => 0))).toBe(false)
  })
})
