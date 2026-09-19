import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { toValueArgsFlat } from './utils'

describe('toValueArgsFlat', () => {
  it('should be defined', () => {
    expect(toValueArgsFlat).toBeDefined()
  })

  it('returns a plain list of values unchanged', () => {
    expect(toValueArgsFlat([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('returns an empty array for no arguments', () => {
    expect(toValueArgsFlat([])).toEqual([])
  })

  it('resolves refs and getters passed as rest arguments', () => {
    expect(toValueArgsFlat([shallowRef(1), () => 2, 3])).toEqual([1, 2, 3])
  })

  it('flattens a single array argument one level', () => {
    expect(toValueArgsFlat([[1, 2, 3]])).toEqual([1, 2, 3])
  })

  it('flattens and resolves a single ref that holds an array', () => {
    expect(toValueArgsFlat([deepRef([1, 2, 3])])).toEqual([1, 2, 3])
  })

  it('flattens a getter that returns an array', () => {
    expect(toValueArgsFlat([() => [1, 2, 3]])).toEqual([1, 2, 3])
  })

  it('resolves refs nested inside a single array argument', () => {
    expect(toValueArgsFlat([[shallowRef(1), shallowRef(2)]])).toEqual([1, 2])
  })
})
