import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, useTemplateRef } from 'vue'
import { useResizeObserver } from '.'

describe('useResizeObserver', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    cleanup()
  })

  it('supports useTemplateRef target and avoids readonly assignment warnings', async () => {
    const callbackMock = vi.fn()
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      const Target = defineComponent({
        template: '<div ref="target" style="width: 10px; height: 10px;"></div>',
        setup() {
          const target = useTemplateRef<HTMLElement>('target')
          useResizeObserver(target, callbackMock)
        },
      })

      page.render(Target)

      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalled()
      })

      const readonlyWarnMessage = 'Set operation on key "value" failed: target is readonly'
      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining(readonlyWarnMessage))
    }
    finally {
      warnSpy.mockRestore()
    }
  })
})
