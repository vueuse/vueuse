import { ref } from 'vue-demi'
import { get } from '.'

describe('get', () => {
  test('unref', () => {
    const a = ref(42)

    expect(get(a)).toBe(42)
    expect(get(42)).toBe(42)
  })

  test('ref object', () => {
    const reactive = ref({ foo: 'bar' })
    const plain = { foo: 'bar' }

    expect(get(reactive, 'foo')).toBe('bar')
    expect(get(plain, 'foo')).toBe('bar')

    // @ts-expect-error cast
    expect(get(reactive, 'bar')).toBeUndefined()
    // @ts-expect-error cast
    expect(get(plain, 'bar')).toBeUndefined()
  })

  test('ref array', () => {
    const reactive = ref([1, 2, 3])
    const plain = [1, 2, 3]

    expect(get(reactive, 2)).toBe(3)
    expect(get(plain, 2)).toBe(3)

    // @ts-expect-error cast
    expect(get(reactive, 'bar')).toBeUndefined()
    // @ts-expect-error cast
    expect(get(plain, 'bar')).toBeUndefined()
  })
})
