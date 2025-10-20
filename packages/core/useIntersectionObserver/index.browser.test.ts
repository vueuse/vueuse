import { page } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, shallowRef, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  const component = defineComponent({
    template: `
      <h1 style="margin-bottom: 100vh;">The target is {{ targetVisible ? 'visible' : 'hidden' }}</h1>
      <div
        ref="observed-target"
        style="width: 200px; height: 200px;"
      >
        Target Element
      </div>
    `,
    setup() {
      const target = useTemplateRef<HTMLElement>('observed-target')
      const targetVisible = shallowRef(false)
      useIntersectionObserver(
        target,
        ([entry]) => {
          targetVisible.value = entry.isIntersecting
        },
      )

      return { targetVisible }
    },
  })

  describe('when target is a single element', () => {
    it('should observe the given target Element', async () => {
      page.render(component)
      const heading = page.getByRole('heading', { level: 1 })

      expect(heading).toHaveTextContent('The target is hidden')

      // the default threshold is 0, so scrolling by 1px is enough to trigger the intersection
      window.scrollTo(0, 1)

      vi.waitFor(() => {
        expect(heading).toHaveTextContent('The target is visible')
      })

      window.scrollTo(0, 0)

      vi.waitFor(() => {
        expect(heading).toHaveTextContent('The target is hidden')
      })
    })
  })
})
