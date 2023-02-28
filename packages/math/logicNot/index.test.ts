import { ref, unref } from 'vue-demi'
import { logicNot } from '.'

describe('logicNot', () => {
  it('should be defined', () => {
    expect(logicNot).toBeDefined()
  })

  it('returns the logical complement of the given ref', () => {
    expect(unref(logicNot(ref(true)))).toBe(false)
    expect(unref(logicNot(ref('foo')))).toBe(false)
    expect(unref(logicNot(ref(1)))).toBe(false)

    expect(unref(logicNot(ref(false)))).toBe(true)
    expect(unref(logicNot(ref('')))).toBe(true)
    expect(unref(logicNot(ref(0)))).toBe(true)
  })

  it('returns the logical complement of the given value', () => {
    expect(unref(logicNot(true))).toBe(false)
    expect(unref(logicNot('foo'))).toBe(false)

    expect(unref(logicNot(false))).toBe(true)
    expect(unref(logicNot(''))).toBe(true)
    expect(unref(logicNot(0))).toBe(true)
  })

  it('returns the logical complement of the given getter function', () => {
    expect(unref(logicNot(() => true))).toBe(false)
    expect(unref(logicNot(() => 'foo'))).toBe(false)

    expect(unref(logicNot(() => false))).toBe(true)
    expect(unref(logicNot(() => 0))).toBe(true)
  })
})
