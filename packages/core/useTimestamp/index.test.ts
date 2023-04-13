import { promiseTimeout } from '@vueuse/shared'
import { useTimestamp } from '.'

describe('useTimestamp', () => {
  it('starts immediately by default', async () => {
    const timestamp = useTimestamp()

    const initial = timestamp.value

    await promiseTimeout(50)

    expect(timestamp.value).greaterThan(initial)
  })

  it('allows for a delayed start using requestAnimationFrame', async () => {
    let now
    const callback = vi.fn((time) => {
      now = time
    })
    const { resume, timestamp } = useTimestamp({
      controls: true,
      immediate: false,
      callback,
    })

    const initial = timestamp.value

    await promiseTimeout(50)

    expect(timestamp.value).toBe(initial)
    expect(now).toBeUndefined()

    resume()

    await promiseTimeout(50)

    expect(timestamp.value).greaterThan(initial)
    expect(now).greaterThan(initial)
  })

  it('allows for a delayed start using common interval', async () => {
    let now
    const callback = vi.fn((time) => {
      now = time
    })
    const { resume, timestamp } = useTimestamp({
      controls: true,
      immediate: false,
      interval: 50,
      callback,
    })

    const initial = timestamp.value

    await promiseTimeout(50)

    expect(timestamp.value).toBe(initial)
    expect(now).toBeUndefined()

    resume()

    await promiseTimeout(50)

    expect(timestamp.value).greaterThan(initial)
    expect(now).greaterThan(initial)
  })
})
