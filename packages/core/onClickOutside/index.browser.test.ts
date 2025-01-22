import { page, userEvent } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, useTemplateRef } from 'vue'
import { onClickOutside } from '.'

const complexComponent = defineComponent({
  template: `
    <div>
      <div ref="target">
        Inside
      </div>

      <div ref="outside">
        Outside
      </div>

      <div>
        Other
      </div>
   </div>
  `,
  setup() {
    const target = useTemplateRef<HTMLDivElement>('target')
    const outside = useTemplateRef<HTMLDivElement>('outside')

    onClickOutside(
      target,
      (...args) => {
        console.log(...args)
      },
      {
        ignore: [outside],
      },
    )

    return {
      target,
      outside,
    }
  },
})

describe('onClickOutside', () => {
  it('should work with ignored element', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const screen = page.render(complexComponent)
    const target = screen.getByText('Inside')
    const outside = screen.getByText('Outside')
    const other = screen.getByText('Other')

    await expect.element(target).toBeInTheDocument()
    await expect.element(outside).toBeInTheDocument()

    await userEvent.click(outside)
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(other)
    expect(consoleSpy).toHaveBeenCalled()
  })
})
