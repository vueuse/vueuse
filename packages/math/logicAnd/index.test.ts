import { describe, expect, it } from 'vitest'
import { shallowRef, toValue } from 'vue'
import { logicAnd } from './index'

describe('logicAnd', () => {
  it('should be defined', () => {
    expect(logicAnd).toBeDefined()
  })

  it('returns true when given no args', () => {
    expect(toValue(logicAnd())).toBe(true)
  })

  it('returns true only when all arguments are truthy', () => {
    expect(toValue(logicAnd(shallowRef(true), shallowRef(true)))).toBe(true)
    expect(toValue(logicAnd(shallowRef('foo'), shallowRef(true)))).toBe(true)
    expect(toValue(logicAnd(shallowRef('foo'), shallowRef(1)))).toBe(true)

    expect(toValue(logicAnd(shallowRef(true), shallowRef(false)))).toBe(false)
    expect(toValue(logicAnd(shallowRef('foo'), shallowRef(0)))).toBe(false)
  })

  it('works with values', () => {
    expect(toValue(logicAnd(true))).toBe(true)
    expect(toValue(logicAnd('foo'))).toBe(true)

    expect(toValue(logicAnd(true, false))).toBe(false)
    expect(toValue(logicAnd(0))).toBe(false)
  })

  it('works with getter functions', () => {
    expect(toValue(logicAnd(() => true))).toBe(true)
    expect(toValue(logicAnd(() => 'foo'))).toBe(true)

    expect(toValue(logicAnd(() => true, () => false))).toBe(false)
    expect(toValue(logicAnd(() => 0))).toBe(false)
  })
})
