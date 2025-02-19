import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { useToString } from './index'

describe('useToString', () => {
  it('default', () => {
    const value = deepRef<any>(123.345)
    const str = useToString(value)

    expect(str.value).toBe('123.345')

    value.value = 'hi'

    expect(str.value).toBe('hi')

    value.value = { foo: 'hi' }

    expect(str.value).toBe('[object Object]')
  })
})
