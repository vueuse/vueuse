import { page } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import Demo from './demo.vue'

describe('useMouse Demo', () => {
  it('should render', async () => {
    const screen = page.render(Demo)
    await expect.element(screen.baseElement).toBeInTheDocument()
  })
})
