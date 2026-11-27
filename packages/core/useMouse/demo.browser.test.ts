import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import Demo from './demo.vue'

describe('useMouse Demo', () => {
  it('should render', async () => {
    const screen = await page.render(Demo)
    await expect.element(screen.baseElement).toBeInTheDocument()
  })
})
