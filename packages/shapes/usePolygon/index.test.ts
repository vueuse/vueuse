import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { usePolygon } from '.'

describe('usePolygon', () => {
  it('should be defined', () => {
    expect(usePolygon).toBeDefined()
  })

  it('should generate vertices equal to the number of sides', () => {
    const polygon = usePolygon({ sides: 5, sideLength: 50 })
    expect(polygon.vertices.value.length).toBe(5)
  })

  it('should generate edges equal to the number of sides', () => {
    const polygon = usePolygon({ sides: 5, sideLength: 50 })
    expect(polygon.edges.value.length).toBe(5)
  })

  it('should accept numbers', () => {
    const polygon = usePolygon({ sides: 5, sideLength: 50 })
    const pos = polygon.getPosition(0.5)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })

  it('should accept refs', () => {
    const sides = ref(5)
    const sideLength = ref(50)
    const polygon = usePolygon({ sides, sideLength })
    const pos = polygon.getPosition(0.5)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)
    const polygon = usePolygon({ sides: 5, sideLength: 50 })
    const pos = polygon.getPosition(position)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })

  it('should accept zero arg', () => {
    const polygon = usePolygon()
    const pos = polygon.getPosition(0.5)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })
})
