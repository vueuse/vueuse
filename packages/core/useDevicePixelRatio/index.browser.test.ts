import { commands, page } from '@vitest/browser/context'
import { describe, expect, it, onTestFailed, onTestFinished, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useDevicePixelRatio } from '.'

const testComponent = defineComponent({
  template: '<div data-testId="data">{{pixelRatio}}</div>',
  setup() {
    const { pixelRatio } = useDevicePixelRatio({ window })

    return { pixelRatio }
  },
})

describe('useDevicePixelRatio', () => {
  it('should be defined', () => {
    expect(useDevicePixelRatio).toBeDefined()
  })

  it('should get the ssr width from the global store', async () => {
    const { pixelRatio } = useDevicePixelRatio()
    expect(pixelRatio.value).toBe(1)
  })

  it('should update the pixel ratio', async () => {
    onTestFinished(() => commands.resetZoom())
    onTestFailed(() => commands.resetZoom())
    const screen = page.render(testComponent)
    expect(screen.getByTestId('data').query()?.textContent).toBe('1')
    await commands.zoomIn()
    await vi.waitFor(() => {
      expect(screen.getByTestId('data').query()?.textContent).toBe('2')
    })
  })
})
