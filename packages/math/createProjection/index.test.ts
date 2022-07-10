import { ref } from 'vue-demi'
import { createProjection } from '.'

describe('createProjection', () => {
  it('should be defined', () => {
    expect(createProjection).toBeDefined()
  })

  it('should work with projector', () => {
    const fromStart = ref(0)
    const fromEnd = ref(10)
    const toRange = ref<[number, number]>([50, 100])

    const useProjector = createProjection(
      () => [fromStart.value, fromEnd.value],
      toRange,
    )
    const input = ref(0)
    const output = useProjector(input)

    expect(output.value).toBe(50)

    input.value = 10
    expect(output.value).toBe(100)

    input.value = 5
    expect(output.value).toBe(75)

    input.value = 1
    expect(output.value).toBe(55)

    fromEnd.value = 20
    expect(output.value).toBe(52.5)

    toRange.value = [80, 120]
    expect(output.value).toBe(82)
  })
})
