import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Demo from './demo.vue'

describe('usePointerLock Demo', () => {
  it('should render', async () => {
    const screen = render(Demo)
    await expect.element(screen.baseElement).toBeInTheDocument()
  })
})
