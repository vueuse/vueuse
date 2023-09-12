import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useSquare } from '.'

describe('useSquare', () => {
  it('should be defined', () => {
    expect(useSquare).toBeDefined()
  })

  it('should generate four vertices', () => {
    const square = useSquare(50)
    expect(square.vertices.value.length).toBe(4)
  })

  it('should generate four edges', () => {
    const square = useSquare(50)
    expect(square.edges.value.length).toBe(4)
  })

  it('should accept numbers', () => {
    const square = useSquare(50)
    expect(square.getPosition(0)).toStrictEqual({
      x: -25,
      y: -25,
    })
  })

  it('should accept refs', () => {
    const sideLength = ref(50)

    const square = useSquare(sideLength)
    expect(square.getPosition(0)).toStrictEqual({
      x: -25,
      y: -25,
    })
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)

    const square = useSquare(50)
    expect(square.getPosition(position)).toStrictEqual({
      x: 25,
      y: -25,
    })
  })

  it('should accept zero arg', () => {
    const square = useSquare()
    expect(square.getPosition(0.25)).toStrictEqual({
      x: 0,
      y: 0,
    })
  })
})
