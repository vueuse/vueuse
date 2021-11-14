import { promiseTimeout } from '@vueuse/shared'
import { useTimestamp } from '.'

describe('useTimestamp', () => {
  it('starts immediately by default', async() => {
    const timestamp = useTimestamp()

    const initial = timestamp.value

    await promiseTimeout(50)

    expect(timestamp.value).toBeGreaterThan(initial)
  })

  it('allows for a delayed start', async() => {
    const { resume, timestamp } = useTimestamp({
      controls: true,
      immediate: false,
    })

    const initial = timestamp.value

    await promiseTimeout(50)

    expect(timestamp.value).toBe(initial)

    resume()

    await promiseTimeout(50)

    expect(timestamp.value).toBeGreaterThan(initial)
  })
})
