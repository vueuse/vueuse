import { ref } from 'vue-demi'
import { useProjection } from '.'

describe('useProjection', () => {
  it('should be defined', () => {
    expect(useProjection).toBeDefined()
  })

  it('should work with projector', () => {
    const domainStart = ref(0)
    const domainEnd = ref(10)
    const valueStart = ref(0)
    const valueEnd = ref(100)

    const [useProjector] = useProjection(domainStart, domainEnd, valueStart, valueEnd)
    const domain = ref(0)
    const value = useProjector(domain)

    expect(value.value).toBe(0)

    domain.value = 10
    expect(value.value).toBe(100)

    domain.value = 5
    expect(value.value).toBe(50)

    domain.value = 1
    expect(value.value).toBe(10)

    domainEnd.value = 20
    expect(value.value).toBe(5)

    valueStart.value = 50
    expect(value.value).toBe(52.5)
  })

  it('should work with co-projector', () => {
    const domainStart = ref(0)
    const domainEnd = ref(10)
    const valueStart = ref(0)
    const valueEnd = ref(100)

    const [, useCoProjector] = useProjection(domainStart, domainEnd, valueStart, valueEnd)
    const value = ref(0)
    const domain = useCoProjector(value)

    expect(domain.value).toBe(0)

    value.value = 100
    expect(domain.value).toBe(10)

    value.value = 50
    expect(domain.value).toBe(5)
  })
})
