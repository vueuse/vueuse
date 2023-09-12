import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useTriangle } from '.'

describe('useTriangle', () => {
  it('should be defined', () => {
    expect(useTriangle).toBeDefined()
  })

  it('should generate three vertices', () => {
    const triangle = useTriangle({ sideLength: 50 })
    expect(triangle.vertices.value.length).toBe(3)
  })

  it('should generate three edges', () => {
    const triangle = useTriangle({ sideLength: 50 })
    expect(triangle.edges.value.length).toBe(3)
  })

  it('should accept refs', () => {
    const sideLength = ref(50)
    const triangle = useTriangle({ sideLength })
    expect(triangle.vertices.value.length).toBe(3)
    expect(triangle.edges.value.length).toBe(3)
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)
    const triangle = useTriangle({ sideLength: 50 })
    const pos = triangle.getPosition(position)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })

  it('should accept zero arg', () => {
    const triangle = useTriangle()
    const pos = triangle.getPosition(0.25)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })
})
