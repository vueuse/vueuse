import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useThrottledRefHistory } from './index'

describe('useThrottledRefHistory - sync', () => {
  it('take first snapshot right after data was changed and second after given time', async () => {
    vi.useFakeTimers()
    const ms = 10
    const v = shallowRef(0)

    const { history } = useThrottledRefHistory(v, { throttle: ms })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 100

    await vi.advanceTimersByTimeAsync(ms * 3)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)

    v.value = 200
    v.value = 300
    v.value = 400

    await vi.advanceTimersByTimeAsync(ms * 3)

    expect(history.value.length).toBe(3)
    expect(history.value[0].snapshot).toBe(400)
  })
})
