import { describe, expect, it } from 'vitest'
import { useIDBKeyval } from './index'

describe('useIDBKeyval SSR', () => {
  it('returns initial value and no-ops writes in SSR', async () => {
    const { data, isFinished, set } = useIDBKeyval('ssr-key', { count: 42 })

    expect(data.value).toEqual({ count: 42 })
    expect(isFinished.value).toBe(false)

    await set({ count: 100 })
    expect(data.value).toEqual({ count: 42 })
  })
})

