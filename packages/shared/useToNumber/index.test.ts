import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useToNumber } from '.'

describe('useToNumber', () => {
  it('default', () => {
    const value = ref<string | number>('123.345')
    const float = useToNumber(value)
    const int = useToNumber(value, { method: 'parseInt' })

    expect(float.value).toBe(123.345)
    expect(int.value).toBe(123)

    value.value = 'hi'

    expect(float.value).toBe(Number.NaN)
    expect(int.value).toBe(Number.NaN)

    value.value = 123.4

    expect(float.value).toBe(123.4)
    expect(int.value).toBe(123.4)

    value.value = '-43.53'

    expect(float.value).toBe(-43.53)
    expect(int.value).toBe(-43)
  })

  it('radix', () => {
    const value = ref<string | number>('0xFA')
    const int = useToNumber(value, { method: 'parseInt', radix: 16 })

    expect(int.value).toBe(250)
  })

  it('nanToZero', () => {
    const value = ref<string | number>('Hi')
    const float = useToNumber(value, { nanToZero: true })
    expect(float.value).toBe(0)
  })

  it('custom method function', () => {
    const value = ref<string | number>(`${Number.MAX_SAFE_INTEGER}1`)
    let warn = ''
    const warnFn = vi.fn(str => warn = str)
    const result = useToNumber(value, { method: (v) => {
      if (!Number.isSafeInteger(Number(v))) {
        warnFn('Value is not a safe integer')
      }
      return 0
    } })
    expect(result.value).toBe(0)
    expect(warn).toBe('Value is not a safe integer')
    expect(warnFn).toHaveBeenCalledTimes(1)
  })
})
