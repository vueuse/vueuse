import { describe, expect, it, vi } from 'vitest'

describe('useIDBKeyval SSR guard (unit)', () => {
  it('returns initial value and no-ops writes when isClient is false', async () => {
    vi.resetModules()
    vi.doMock('@vueuse/shared', async () => {
      const actual = await vi.importActual<typeof import('@vueuse/shared')>('@vueuse/shared')
      return {
        ...actual,
        isClient: false,
      }
    })

    const { useIDBKeyval } = await import('./index')

    const { data, isFinished, set } = useIDBKeyval('ssr-key', { count: 42 })
    expect(data.value).toEqual({ count: 42 })
    expect(isFinished.value).toBe(false)

    await set({ count: 100 })
    expect(data.value).toEqual({ count: 42 })
  })
})
