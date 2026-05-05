import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, shallowRef } from 'vue'
import { useScrollbarWidth } from './index'

const Component = defineComponent({
  template: `
    <div>
      <div
        ref="el"
        data-testid="scroller"
        style="overflow: auto; width: 200px; height: 100px;"
      >
        <div style="width: 1px; height: 400px;" />
      </div>
      <pre data-testid="width">{{ scrollbarWidth }}</pre>
    </div>
  `,
  setup() {
    const el = shallowRef<HTMLDivElement | null>(null)
    const scrollbarWidth = useScrollbarWidth(el)
    return { el, scrollbarWidth }
  },
})

describe('useScrollbarWidth', () => {
  it('reports the scrollbar width once the element is mounted', async () => {
    const screen = page.render(Component)
    const widthEl = screen.getByTestId('width')
    await expect.element(widthEl).toBeVisible()

    // Wait for ResizeObserver callback
    await new Promise(r => setTimeout(r, 50))

    const reported = Number(widthEl.query()?.textContent)
    const scroller = screen.getByTestId('scroller').query() as HTMLElement
    const expected = scroller.offsetWidth - scroller.clientWidth

    expect(reported).toBe(expected)
    expect(reported).toBeGreaterThanOrEqual(0)
  })

  it('returns 0 when the target ref is null', () => {
    const NullComponent = defineComponent({
      template: `<pre data-testid="width">{{ scrollbarWidth }}</pre>`,
      setup() {
        const el = shallowRef<HTMLElement | null>(null)
        const scrollbarWidth = useScrollbarWidth(el)
        return { scrollbarWidth }
      },
    })
    const screen = page.render(NullComponent)
    expect(screen.getByTestId('width').query()?.textContent).toBe('0')
  })
})
