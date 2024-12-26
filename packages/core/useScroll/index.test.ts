import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { useScroll } from '.'

describe('useScroll', () => {
  it('should be defined', () => {
    expect(useScroll).toBeDefined()
  })

  it('should have default x and y', async () => {
    const { x, y } = useScroll(window)
    expect(x.value).toBe(0)
    expect(y.value).toBe(0)
  })

  it('should have right default values', () => {
    const values = reactive(useScroll(window))
    expect(values).toMatchInlineSnapshot(`
      {
        "arrivedState": {
          "bottom": true,
          "left": true,
          "right": true,
          "top": true,
        },
        "directions": {
          "bottom": false,
          "left": false,
          "right": false,
          "top": false,
        },
        "isScrolling": false,
        "measure": [Function],
        "x": 0,
        "y": 0,
      }
    `)
  })
})
