import { ref } from 'vue-demi'
import { createProjection } from '.'

describe('createProjection', () => {
  it('should be defined', () => {
    expect(createProjection).toBeDefined()
  })

  it('should work with projector', () => {
    const fromStart = ref(0)
    const fromEnd = ref(10)
    const toRange = ref<[number, number]>([1, 100])

    const useProjector = createProjection(
      () => [fromStart.value, fromEnd.value],
      toRange,
    )
    const domain = ref(0)
    const value = useProjector(domain)

    expect(value.value).toBe(0)

    domain.value = 10
    expect(value.value).toBe(100)

    domain.value = 5
    expect(value.value).toBe(50)

    domain.value = 1
    expect(value.value).toBe(10)

    fromEnd.value = 20
    expect(value.value).toBe(5)

    toRange.value[0] = 50
    expect(value.value).toBe(52.5)
  })
})
