import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, useTemplateRef } from 'vue'
import { onClickOutside } from './index'

function getComplexComponent(useGetter = false) {
  return defineComponent({
    template: `
    <div>
      <div ref="target">
        Inside
      </div>

      <div ref="outside">
        Outside
        <label>
          <input type="radio"/>
          <span>Label</span>
        </label>
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
        useGetter ? () => target.value : target,
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
}

describe('onClickOutside', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should work with ignored element', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const screen = page.render(getComplexComponent())
    const target = screen.getByText('Inside')
    const outside = screen.getByText('Outside')
    const label = screen.getByText('Label')
    const other = screen.getByText('Other')

    await expect.element(target).toBeInTheDocument()
    await expect.element(outside).toBeInTheDocument()
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(outside)
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(label)
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(other)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should detect iframe inside shadow DOM with detectIframe option', async () => {
    const handler = vi.fn()

    const component = defineComponent({
      template: `<div ref="target">Inside</div>`,
      setup() {
        const target = useTemplateRef<HTMLDivElement>('target')
        onClickOutside(target, handler, { detectIframe: true })
        return { target }
      },
    })

    const screen = page.render(component)
    await expect.element(screen.getByText('Inside')).toBeInTheDocument()

    const host = document.createElement('div')
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const iframe = document.createElement('iframe')
    shadowRoot.appendChild(iframe)
    document.body.appendChild(host)

    await userEvent.click(iframe)
    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  it('should detect iframe inside nested shadow DOM with detectIframe option', async () => {
    const handler = vi.fn()

    const component = defineComponent({
      template: `<div ref="target">Inside</div>`,
      setup() {
        const target = useTemplateRef<HTMLDivElement>('target')
        onClickOutside(target, handler, { detectIframe: true })
        return { target }
      },
    })

    const screen = page.render(component)
    await expect.element(screen.getByText('Inside')).toBeInTheDocument()

    // <outer-host> > shadow-root > <inner-host> > shadow-root > <iframe>
    const outerHost = document.createElement('div')
    const outerShadow = outerHost.attachShadow({ mode: 'open' })
    const innerHost = document.createElement('div')
    const innerShadow = innerHost.attachShadow({ mode: 'open' })
    const iframe = document.createElement('iframe')
    innerShadow.appendChild(iframe)
    outerShadow.appendChild(innerHost)
    document.body.appendChild(outerHost)

    // Playwright cannot click an iframe nested 2 levels deep in shadow DOM
    iframe.focus()
    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  it('allow the value of target to be a getter', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const screen = page.render(getComplexComponent(true))
    const target = screen.getByText('Inside')
    const other = screen.getByText('Other')

    await expect.element(target).toBeInTheDocument()
    await expect.element(other).toBeInTheDocument()
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(target)
    expect(consoleSpy).not.toHaveBeenCalled()
    await userEvent.click(other)
    expect(consoleSpy).toHaveBeenCalled()
  })
})
