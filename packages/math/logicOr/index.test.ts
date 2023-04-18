import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { toValue } from '@vueuse/shared'
import { logicOr } from '.'

describe('logicOr', () => {
  it('should be defined', () => {
    expect(logicOr).toBeDefined()
  })

  it('returns false when given no args', () => {
    expect(toValue(logicOr())).toBe(false)
  })

  it('returns true only when any arguments are truthy', () => {
    expect(toValue(logicOr(ref(true), ref(true)))).toBe(true)
    expect(toValue(logicOr(ref('foo'), ref(false)))).toBe(true)
    expect(toValue(logicOr(ref('foo'), ref(1), ref(false)))).toBe(true)

    expect(toValue(logicOr(ref(false), ref(false)))).toBe(false)
    expect(toValue(logicOr(ref(''), ref(0)))).toBe(false)
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
