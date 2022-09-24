import { ref } from 'vue-demi'
import { reactify } from '.'

describe('reactify', () => {
  it('one arg', () => {
    const base = ref(1.5)
    const floor = reactify(Math.floor)
    const result = floor(base)

    expect(result.value).toBe(1)

    base.value = 2.8

    expect(result.value).toBe(2)
  })

  it('two args', () => {
    const base = ref(0)
    const exponent = ref(0)
    const pow = reactify(Math.pow)
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

  it('mixed with literal', () => {
    const base = ref(0)
    const pow = reactify(Math.pow)
    const result = pow(base, 2)

    expect(base.value).toBe(0)
    expect(result.value).toBe(0)

    base.value = 10
    expect(result.value).toBe(100)
  })

  it('JSON.stringify', () => {
    const base = ref<any>(0)
    const stringify = reactify(JSON.stringify)
    const result = stringify(base, null, 2)

    expect(base.value).toBe(0)
    expect(result.value).toBe('0')

    base.value = { foo: 'bar' }
    expect(result.value).toBe('{\n  "foo": "bar"\n}')
  })

  it('Pythagorean theorem', () => {
    const pow = reactify(Math.pow)
    const sqrt = reactify(Math.sqrt)
    const add = reactify((a: number, b: number) => a + b)

    const a = ref(3)
    const b = ref(4)

    const c = sqrt(add(pow(a, 2), pow(b, 2)))

    expect(c.value).toBe(5)

    a.value = 5
    b.value = 12

    expect(c.value).toBe(13)
  })

  it('computed getter', () => {
    const add = reactify((a: number, b: number) => a + b)

    const a = ref(3)
    const b = ref(4)

    const c = add(a, () => b.value)

    expect(c.value).toBe(7)

    b.value = 12

    expect(c.value).toBe(15)
  })
})
