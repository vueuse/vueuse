import { ref } from 'vue-demi'
import { useToNumber } from '.'

describe('useToNumber', () => {
  it('default', () => {
    const value = ref<string | number>('123.345')
    const float = useToNumber(value)
    const int = useToNumber(value, { method: 'parseInt' })

    expect(float.value).toBe(123.345)
    expect(int.value).toBe(123)

    value.value = 'hi'

    expect(float.value).toBe(NaN)
    expect(int.value).toBe(NaN)

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
})
