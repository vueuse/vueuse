import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useElementSize } from './index'

describe('useElementSize', () => {
  // The element uses `box-sizing: border-box` with a 200x100 outer size,
  // 10px padding and 5px border on each side, so:
  //   - border-box measurement => 200 x 100
  //   - content-box measurement => 200 - 20 - 10 = 170 wide, 100 - 20 - 10 = 70 tall
  describe('test box sizing', () => {
    let el: HTMLDivElement

    beforeEach(() => {
      el = document.createElement('div')
      el.style.cssText = 'width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: border-box;'
      document.body.appendChild(el)
    })

    afterEach(() => {
      el.remove()
    })

    it('should prefill with border-box dimensions when box is border-box', () => {
      const { width, height } = useElementSize(el, { width: 0, height: 0 }, { box: 'border-box' })
      expect(width.value).toBe(200)
      expect(height.value).toBe(100)
    })

    it('should prefill with content-box dimensions when box is content-box', () => {
      const { width, height } = useElementSize(el, { width: 0, height: 0 }, { box: 'content-box' })
      expect(width.value).toBe(170)
      expect(height.value).toBe(70)
    })

    it('should prefill with content-box dimensions by default', () => {
      const { width, height } = useElementSize(el)
      expect(width.value).toBe(170)
      expect(height.value).toBe(70)
    })
  })

  describe('test transform scale', () => {
    let div: HTMLDivElement, svg: SVGElement

    beforeEach(() => {
      div = document.createElement('div')
      div.style.cssText = 'width: 100px; height: 100px; transform: scale(0.5);'
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', '100px')
      svg.setAttribute('height', '100px')
      svg.style.cssText = 'transform: scale(0.5);'
      document.body.appendChild(div)
      document.body.appendChild(svg)
    })

    afterEach(() => {
      div.remove()
      svg.remove()
    })

    it('should return layout size for DOM elements', () => {
      const { width, height } = useElementSize(div, { width: 0, height: 0 })
      expect(width.value).toBe(100)
      expect(height.value).toBe(100)
    })

    it('should return layout size for SVG elements', () => {
      const { width, height } = useElementSize(svg, { width: 0, height: 0 })
      expect(width.value).toBe(100)
      expect(height.value).toBe(100)
    })
  })
})
