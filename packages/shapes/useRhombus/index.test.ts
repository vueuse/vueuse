import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useRhombus } from '.'

describe('useRhombus', () => {
  it('should be defined', () => {
    expect(useRhombus).toBeDefined()
  })

  it('should generate four vertices', () => {
    const rhombus = useRhombus({ d1: 50, d2: 50 })
    expect(rhombus.vertices.value.length).toBe(4)
  })

  it('should generate four edges', () => {
    const rhombus = useRhombus({ d1: 50, d2: 50 })
    expect(rhombus.edges.value.length).toBe(4)
  })

  it('should accept numbers', () => {
    const rhombus = useRhombus({ d1: 50, d2: 50 })
    expect(rhombus.vertices.value.length).toBe(4)
    expect(rhombus.edges.value.length).toBe(4)
  })

  it('should accept refs', () => {
    const sideLength = ref(50)
    const rhombus = useRhombus({ d1: sideLength, d2: sideLength })
    expect(rhombus.vertices.value.length).toBe(4)
    expect(rhombus.edges.value.length).toBe(4)
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)
    const rhombus = useRhombus({ d1: 50, d2: 50 })
    const pos = rhombus.getPosition(position)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })

  it('should accept zero arg', () => {
    const rhombus = useRhombus()
    const pos = rhombus.getPosition(0.25)
    expect(pos).toBeDefined()
    expect(pos).toHaveProperty('x')
    expect(pos).toHaveProperty('y')
  })
})
