import { ref } from 'vue-demi'
import { useMath } from '.'

describe('useMath', () => {
  it('should be defined', () => {
    const methods = useMath()
    // expect(useMath).toBeDefined()
    expect(methods).toMatchInlineSnapshot(`
      {
        "abs": [Function],
        "acos": [Function],
        "acosh": [Function],
        "asin": [Function],
        "asinh": [Function],
        "atan": [Function],
        "atan2": [Function],
        "atanh": [Function],
        "cbrt": [Function],
        "ceil": [Function],
        "clz32": [Function],
        "cos": [Function],
        "cosh": [Function],
        "exp": [Function],
        "expm1": [Function],
        "floor": [Function],
        "fround": [Function],
        "hypot": [Function],
        "imul": [Function],
        "log": [Function],
        "log10": [Function],
        "log1p": [Function],
        "log2": [Function],
        "max": [Function],
        "min": [Function],
        "pow": [Function],
        "random": [Function],
        "round": [Function],
        "sign": [Function],
        "sin": [Function],
        "sinh": [Function],
        "sqrt": [Function],
        "tan": [Function],
        "tanh": [Function],
        "trunc": [Function],
      }
    `)
  })
  it('should accept max', () => {
    const value1 = ref(10)
    const value2 = ref(20)
    const { max } = useMath()
    const result = max(value1, value2, 100, 4, 5)
    expect(result.value).toMatchInlineSnapshot('100')
    value1.value = 300
    expect(result.value).toMatchInlineSnapshot('300')
  })
  it('should accept min', () => {
    const value1 = ref(10)
    const value2 = ref(20)
    const { min } = useMath()
    const result = min(value1, value2, 5, 300)
    expect(result.value).toMatchInlineSnapshot('5')
    value2.value = 2
    expect(result.value).toMatchInlineSnapshot('2')
  })
  it('should accept floor', () => {
    const value1 = ref(1.1)
    const { floor } = useMath()
    const result = floor(value1)
    expect(result.value).toMatchInlineSnapshot('1')
    value1.value = 5.2
    expect(result.value).toMatchInlineSnapshot('5')
  })
  it('should accept round', () => {
    const value1 = ref(4.5)
    const { round } = useMath()
    const result = round(value1)
    expect(result.value).toMatchInlineSnapshot('5')
    value1.value = 5.2
    expect(result.value).toMatchInlineSnapshot('5')
  })
  it('should accept pow', () => {
    const value1 = ref(4)
    const { pow } = useMath()
    const result = pow(value1, 2)
    expect(result.value).toMatchInlineSnapshot('16')
    value1.value = 5
    expect(result.value).toMatchInlineSnapshot('25')
  })
})
