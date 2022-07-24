import { ref, unref } from 'vue-demi'
import { logicAnd } from '.'

describe('logicAnd', () => {
  it('should be defined', () => {
    expect(logicAnd).toBeDefined()
  })

  it('returns true when given no args', () => {
    expect(unref(logicAnd())).toBe(true)
  })

  it('returns true only when all arguments are truthy', () => {
    expect(unref(logicAnd(ref(true), ref(true)))).toBe(true)
    expect(unref(logicAnd(ref('foo'), ref(true)))).toBe(true)
    expect(unref(logicAnd(ref('foo'), ref(1)))).toBe(true)

    expect(unref(logicAnd(ref(true), ref(false)))).toBe(false)
    expect(unref(logicAnd(ref('foo'), ref(0)))).toBe(false)
  })

  it('works with values', () => {
    expect(unref(logicAnd(true))).toBe(true)
    expect(unref(logicAnd('foo'))).toBe(true)

    expect(unref(logicAnd(true, false))).toBe(false)
    expect(unref(logicAnd(0))).toBe(false)
  })

  it('works with getter functions', () => {
    expect(unref(logicAnd(() => true))).toBe(true)
    expect(unref(logicAnd(() => 'foo'))).toBe(true)

    expect(unref(logicAnd(() => true, () => false))).toBe(false)
    expect(unref(logicAnd(() => 0))).toBe(false)
  })
})
