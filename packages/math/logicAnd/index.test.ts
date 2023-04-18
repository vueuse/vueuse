import { ref } from 'vue-demi'
import { toValue } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { logicAnd } from '.'

describe('logicAnd', () => {
  it('should be defined', () => {
    expect(logicAnd).toBeDefined()
  })

  it('returns true when given no args', () => {
    expect(toValue(logicAnd())).toBe(true)
  })

  it('returns true only when all arguments are truthy', () => {
    expect(toValue(logicAnd(ref(true), ref(true)))).toBe(true)
    expect(toValue(logicAnd(ref('foo'), ref(true)))).toBe(true)
    expect(toValue(logicAnd(ref('foo'), ref(1)))).toBe(true)

    expect(toValue(logicAnd(ref(true), ref(false)))).toBe(false)
    expect(toValue(logicAnd(ref('foo'), ref(0)))).toBe(false)
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
