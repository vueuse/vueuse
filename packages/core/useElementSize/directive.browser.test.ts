import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { vElementSize } from './directive'

// The element uses `box-sizing: border-box` with a 200x100 outer size,
// 10px padding and 5px border on each side, so:
//   - border-box measurement => 200 x 100
//   - content-box measurement => 200 - 20 - 10 = 170 wide, 100 - 20 - 10 = 70 tall
const Component = defineComponent({
  props: ['onResize', 'options'],
  directives: {
    elementSize: vElementSize,
  },
  template: `<div
    data-testid="target"
    style="width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: border-box;"
    v-element-size="[onResize, { width: 0, height: 0 }, options]"
  >Hello world!</div>`,
})

describe('vElementSize', () => {
  it('should call the handler once with border-box dimensions', async () => {
    const onResize = vi.fn()
    const screen = page.render(Component, { props: { onResize, options: { box: 'border-box' } } })
    await expect.element(screen.getByTestId('target')).toBeVisible()
    // give the ResizeObserver a chance to report so a double-fire would surface
    await promiseTimeout(50)

    expect(onResize).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledWith({ width: 200, height: 100 })
  })

  it('should call the handler once with content-box dimensions', async () => {
    const onResize = vi.fn()
    const screen = page.render(Component, { props: { onResize, options: { box: 'content-box' } } })
    await expect.element(screen.getByTestId('target')).toBeVisible()
    await promiseTimeout(50)

    expect(onResize).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledWith({ width: 170, height: 70 })
  })
})
