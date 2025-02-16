import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { reactifyObject } from './index'

describe('reactifyObject', () => {
  it('math', () => {
    const { pow } = reactifyObject(Math, { includeOwnProperties: true })

    const base = shallowRef(0)
    const exponent = shallowRef(0)
    const result = pow(base, exponent)

    expect(base.value).toBe(0)
    expect(result.value).toBe(1)

    base.value = 2
    exponent.value = 2

    expect(result.value).toBe(4)

    base.value = 3

    expect(result.value).toBe(9)

    exponent.value = 3

    expect(result.value).toBe(27)
  })

  it('jSON', () => {
    const { stringify, parse } = reactifyObject(JSON)

    const base = shallowRef('{"foo":"bar"}')
    const result = stringify(parse(base))

    expect(result.value).toBe(base.value)

    base.value = '{"bar":42}'

    expect(result.value).toBe(base.value)
  })
})
