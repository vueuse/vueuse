import { ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useCircle } from '.'

describe('useCircle', () => {
  it('should be defined', () => {
    expect(useCircle).toBeDefined()
  })

  it('should accept numbers', () => {
    const circle = useCircle({ radius: 50 })
    expect(circle.getPosition(0.25)).toStrictEqual({
      x: 0,
      y: 50,
    })
  })

  it('should accept refs', () => {
    const radius = ref(50)
    const circle = useCircle({ radius })
    expect(circle.getPosition(0.25)).toStrictEqual({
      x: 0,
      y: 50,
    })
  })

  it('should accept refs in position method', () => {
    const position = ref(0.25)
    const circle = useCircle({ radius: 50 })
    expect(circle.getPosition(position)).toStrictEqual({
      x: 0,
      y: 50,
    })
  })

  it('should accept zero arg', () => {
    const circle = useCircle()
    expect(circle.getPosition(0.25)).toStrictEqual({
      x: 0,
      y: 0,
    })
  })
})
