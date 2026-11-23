import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, isReadonly, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { useElementSize } from './index'

// The element uses `box-sizing: border-box` with a 200x100 outer size,
// 10px padding and 5px border on each side, so:
//   - border-box measurement => 200 x 100
//   - content-box measurement => 200 - 20 - 10 = 170 wide, 100 - 20 - 10 = 70 tall
describe('useElementSize', () => {
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
    const { width, height } = useElementSize(el, { box: 'border-box' })
    expect(width.value).toBe(200)
    expect(height.value).toBe(100)
  })

  it('should prefill with content-box dimensions when box is content-box', () => {
    const { width, height } = useElementSize(el, { box: 'content-box' })
    expect(width.value).toBe(170)
    expect(height.value).toBe(70)
  })

  it('should prefill with content-box dimensions by default', () => {
    const { width, height } = useElementSize(el)
    expect(width.value).toBe(170)
    expect(height.value).toBe(70)
  })

  it('should keep the size measured on mount when the template ref is set', async () => {
    const widths: number[] = []
    const Component = defineComponent({
      template: `<div ref="target" style="width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: border-box;" />`,
      setup() {
        const { width } = useElementSize(useTemplateRef<HTMLElement>('target'))
        watch(width, value => widths.push(value), { flush: 'sync' })
      },
    })
    await page.render(Component)
    await nextTick()

    expect(widths).toEqual([170])
  })

  it('should not report a negative size for a hidden element with padding', async () => {
    const sizes: number[] = []
    const Component = defineComponent({
      template: `<div ref="target" style="display: none; padding: 10px; border: 5px solid black;" />`,
      setup() {
        const { width, height } = useElementSize(useTemplateRef<HTMLElement>('target'))
        watch([width, height], value => sizes.push(...value), { flush: 'sync' })
      },
    })
    await page.render(Component)
    await nextTick()

    expect(sizes.filter(size => size < 0)).toEqual([])
  })

  it('should return readonly refs', () => {
    const { width, height } = useElementSize(el)

    expect(isReadonly(width)).toBe(true)
    expect(isReadonly(height)).toBe(true)
  })

  describe('initials', () => {
    // a target that is never set keeps the initial values
    const unsetTarget = () => shallowRef<HTMLElement>()

    it('should default to 0', () => {
      const { width, height } = useElementSize(unsetTarget())

      expect(width.value).toBe(0)
      expect(height.value).toBe(0)
    })

    it('should seed from plain values', () => {
      const { width, height } = useElementSize(unsetTarget(), { initials: { width: 300, height: 200 } })

      expect(width.value).toBe(300)
      expect(height.value).toBe(200)
    })

    it('should use passed refs as internal state', () => {
      const width = shallowRef(300)
      const height = shallowRef(200)

      const size = useElementSize(el, { initials: { width, height } })

      expect(size.width).not.toBe(width)
      expect(width.value).toBe(170)
      expect(height.value).toBe(70)

      width.value = 42
      expect(size.width.value).toBe(42)
    })

    it('should support the deprecated initialSize argument', () => {
      const { width, height } = useElementSize(unsetTarget(), { width: 300, height: 200 })

      expect(width.value).toBe(300)
      expect(height.value).toBe(200)
    })

    it('should support the deprecated initialSize argument with options', () => {
      const { width, height } = useElementSize(el, { width: 300, height: 200 }, { box: 'border-box' })

      expect(width.value).toBe(200)
      expect(height.value).toBe(100)
    })

    it('should prefer initials over the deprecated initialSize argument', () => {
      const { width, height } = useElementSize(
        unsetTarget(),
        { width: 1, height: 2 },
        { initials: { width: 300 } },
      )

      expect(width.value).toBe(300)
      expect(height.value).toBe(2)
    })
  })
})
