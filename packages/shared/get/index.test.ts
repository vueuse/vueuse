import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { get } from './index'

describe('get', () => {
  it('unref', () => {
    const a = shallowRef(42)

    expect(get(a)).toBe(42)
    expect(get(42)).toBe(42)
  })

  it('ref object', () => {
    const reactive = deepRef({ foo: 'bar' })
    const plain = { foo: 'bar' }

    expect(get(reactive, 'foo')).toBe('bar')
    expect(get(plain, 'foo')).toBe('bar')

    // @ts-expect-error cast
    expect(get(reactive, 'bar')).toBeUndefined()
    // @ts-expect-error cast
    expect(get(plain, 'bar')).toBeUndefined()
  })

  it('ref array', () => {
    const reactive = deepRef([1, 2, 3])
    const plain = [1, 2, 3]

    expect(get(reactive, 2)).toBe(3)
    expect(get(plain, 2)).toBe(3)

    // @ts-expect-error cast
    expect(get(reactive, 'bar')).toBeUndefined()
    // @ts-expect-error cast
    expect(get(plain, 'bar')).toBeUndefined()
  })
})
