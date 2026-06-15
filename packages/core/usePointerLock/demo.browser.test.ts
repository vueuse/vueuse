import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import Demo from './demo.vue'

describe('usePointerLock Demo', () => {
  it('should render', async () => {
    const screen = page.render(Demo)
    await expect.element(screen.baseElement).toBeInTheDocument()
  })

  it('should not throw error when click or hover', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    const screen = page.render(Demo)
    await userEvent.hover(screen.baseElement)
    expect(consoleErrorSpy).not.toHaveBeenCalled()
    await userEvent.click(screen.baseElement)
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
