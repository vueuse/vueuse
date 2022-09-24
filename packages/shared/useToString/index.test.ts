import { ref } from 'vue-demi'
import { useToString } from '.'

describe('useToString', () => {
  it('default', () => {
    const value = ref<any>(123.345)
    const str = useToString(value)

    expect(str.value).toBe('123.345')

    value.value = 'hi'

    expect(str.value).toBe('hi')

    value.value = { foo: 'hi' }

    expect(str.value).toBe('[object Object]')
  })
})
