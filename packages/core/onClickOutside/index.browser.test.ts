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

  it('should trigger handler when clicking dialog backdrop', async () => {
    const handler = vi.fn()

    const component = defineComponent({
      template: `<dialog ref="dialog" style="width:200px;height:200px;margin:auto;padding:0;"><div>Dialog Content</div></dialog>`,
      setup() {
        const dialog = useTemplateRef<HTMLDialogElement>('dialog')
        onClickOutside(dialog, handler)
        return { dialog }
      },
      mounted() {
        (this.$refs.dialog as HTMLDialogElement).showModal()
      },
    })

    const screen = page.render(component)
    await expect.element(screen.getByText('Dialog Content')).toBeInTheDocument()

    const dialog = document.querySelector('dialog')!
    const rect = dialog.getBoundingClientRect()

    dialog.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      composed: true,
      clientX: rect.left - 10,
      clientY: rect.top - 10,
    }))
    dialog.dispatchEvent(new PointerEvent('click', {
      bubbles: true,
      composed: true,
      clientX: rect.left - 10,
      clientY: rect.top - 10,
    }))

    expect(handler).toHaveBeenCalledOnce()
  })

  it('should not trigger handler when clicking inside modal dialog', async () => {
    const handler = vi.fn()

    const component = defineComponent({
      template: `<dialog ref="dialog" style="width:200px;height:200px;margin:auto;padding:0;"><div>Dialog Content</div></dialog>`,
      setup() {
        const dialog = useTemplateRef<HTMLDialogElement>('dialog')
        onClickOutside(dialog, handler)
        return { dialog }
      },
      mounted() {
        (this.$refs.dialog as HTMLDialogElement).showModal()
      },
    })

    const screen = page.render(component)
    await expect.element(screen.getByText('Dialog Content')).toBeInTheDocument()

    const dialog = document.querySelector('dialog')!
    const rect = dialog.getBoundingClientRect()

    dialog.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      composed: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }))
    dialog.dispatchEvent(new PointerEvent('click', {
      bubbles: true,
      composed: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }))

    expect(handler).not.toHaveBeenCalled()
  })
})
