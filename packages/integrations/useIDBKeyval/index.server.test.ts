import { get, set, update } from 'idb-keyval'
import { describe, expect, it, vi } from 'vitest'
import { useIDBKeyval } from './index'

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  del: vi.fn(),
}))

describe('useIDBKeyval SSR', () => {
  it('does not access IndexedDB when it is unavailable', async () => {
    const { data, isFinished, set: setData } = useIDBKeyval('key', 'initial')

    expect(data.value).toBe('initial')
    expect(isFinished.value).toBe(true)
    expect(get).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()

    await setData('updated')

    expect(data.value).toBe('updated')
    expect(set).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()
  })
})
