import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useRectangle } from '.'

describe('useRectangle', () => {
  it('should be defined', () => {
    expect(useRectangle).toBeDefined()
  })

  it('should generate four vertices', () => {
    const rectangle = useRectangle({ width: 50, height: 50 })
    expect(rectangle.vertices.value.length).toBe(4)
  })

  it('should generate four edges', () => {
    const rectangle = useRectangle({ width: 50, height: 50 })
    expect(rectangle.edges.value.length).toBe(4)
  })

  it('should accept numbers', () => {
    const rectangle = useRectangle({ width: 50, height: 50 })
    expect(rectangle.getPosition(0)).toStrictEqual({
      x: -25,
      y: -25,
    })
  })

  it('should accept refs', () => {
    const sideLength = ref(50)
    const rectangle = useRectangle({ width: sideLength, height: sideLength })
    expect(rectangle.getPosition(0)).toStrictEqual({
      x: -25,
      y: -25,
    })
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)
    const rectangle = useRectangle({ width: 50, height: 50 })
    expect(rectangle.getPosition(position)).toStrictEqual({
      x: 25,
      y: -25,
    })
  })

  it('should accept zero arg', () => {
    const rectangle = useRectangle()
    expect(rectangle.getPosition(0.25)).toStrictEqual({
      x: 0,
      y: 0,
    })
  })
})
