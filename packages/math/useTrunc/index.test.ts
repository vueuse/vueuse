import { ref } from 'vue-demi'
import { useTrunc } from '.'

// Returns:
//  0        ->  0
// -0        -> -0
//  0.2      ->  0
// -0.2      -> -0
//  0.7      ->  0
// -0.7      -> -0
//  Infinity ->  Infinity
// -Infinity -> -Infinity
//  NaN      ->  NaN
//  null     ->  0

describe('useTrunk', () => {
  it('should be defined', () => {
    expect(useTrunc).toBeDefined()
  })
  it('should work', () => {
    const base = ref(1.95)
    const result = useTrunc(base)
    expect(result.value).toBe(1)
    base.value = -7.004
    expect(result.value).toBe(-7)

    base.value = 0
    expect(result.value).toBe(0)
    base.value = -0
    expect(result.value).toBe(-0)

    base.value = 0.2
    expect(result.value).toBe(0)
    base.value = -0.2
    expect(result.value).toBe(-0)

    base.value = Infinity
    expect(result.value).toBe(Infinity)
    base.value = -Infinity
    expect(result.value).toBe(-Infinity)
    base.value = NaN
    expect(result.value).toBe(NaN)
  })
})
