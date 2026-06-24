import { describe, expect, it, vi } from 'vitest'
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

    const scroller = screen.getByTestId('scroller').query() as HTMLElement
    // Measured against the live DOM rather than a hard-coded value, since the
    // scrollbar width varies across operating systems and browsers (0 for overlay
    // scrollbars). The vertical overflow guarantees a horizontal scrollbar.
    const expected = scroller.offsetWidth - scroller.clientWidth

    // useResizeObserver fires its callback asynchronously after mount
    await vi.waitFor(() => {
      expect(Number(widthEl.query()?.textContent)).toBe(expected)
    })
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
