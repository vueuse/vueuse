import { ref } from 'vue-demi'
import { useRandomInteger } from '.'

describe('useRandomInteger', () => {
  it('should be defined', () => {
    expect(useRandomInteger).toBeDefined()
  })

  it('integer value range in [min, max]', () => {
    const min = ref(10)
    const max = ref(100)
    const integer = useRandomInteger(min, max)
    expect(integer.value).toBeGreaterThanOrEqual(min.value)
    expect(integer.value).toBeLessThanOrEqual(max.value)
  })

  it('min greater than max', () => {
    const min = ref(100)
    const max = ref(10)
    const integer = useRandomInteger(min, max)
    expect(integer.value).toBeGreaterThanOrEqual(max.value)
    expect(integer.value).toBeLessThanOrEqual(min.value)
  })
})
