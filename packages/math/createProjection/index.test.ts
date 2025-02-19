import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { createProjection } from './index'

describe('createProjection', () => {
  it('should be defined', () => {
    expect(createProjection).toBeDefined()
  })

  it('should work with projector', () => {
    const fromStart = shallowRef(0)
    const fromEnd = shallowRef(10)
    const toRange = deepRef<[number, number]>([50, 100])

    const useProjector = createProjection(
      () => [fromStart.value, fromEnd.value],
      toRange,
    )
    const input = shallowRef(0)
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
