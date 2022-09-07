import { ref, unref } from 'vue-demi'
import { logicOr } from '.'

describe('logicOr', () => {
  it('should be defined', () => {
    expect(logicOr).toBeDefined()
  })

  it('returns false when given no args', () => {
    expect(unref(logicOr())).toBe(false)
  })

  it('returns true only when any arguments are truthy', () => {
    expect(unref(logicOr(ref(true), ref(true)))).toBe(true)
    expect(unref(logicOr(ref('foo'), ref(false)))).toBe(true)
    expect(unref(logicOr(ref('foo'), ref(1), ref(false)))).toBe(true)

    expect(unref(logicOr(ref(false), ref(false)))).toBe(false)
    expect(unref(logicOr(ref(''), ref(0)))).toBe(false)
  })

  it('works with values', () => {
    expect(unref(logicOr(true))).toBe(true)
    expect(unref(logicOr(true, false))).toBe(true)
    expect(unref(logicOr('foo'))).toBe(true)

    expect(unref(logicOr(false))).toBe(false)
    expect(unref(logicOr(''))).toBe(false)
    expect(unref(logicOr(0))).toBe(false)
  })

  it('works with getter functions', () => {
    expect(unref(logicOr(() => true))).toBe(true)
    expect(unref(logicOr(() => true, () => false))).toBe(true)
    expect(unref(logicOr(() => 'foo'))).toBe(true)

    expect(unref(logicOr(() => false))).toBe(false)
    expect(unref(logicOr(() => ''))).toBe(false)
    expect(unref(logicOr(() => 0))).toBe(false)
  })
})
