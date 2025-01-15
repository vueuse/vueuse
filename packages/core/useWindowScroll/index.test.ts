import { useScroll } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { useWindowScroll } from '.'

describe('useWindowScroll', () => {
  it('should be defined', () => {
    expect(useWindowScroll).toBeDefined()
  })

  it('should have default x and y', () => {
    const { x, y } = useWindowScroll()
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
