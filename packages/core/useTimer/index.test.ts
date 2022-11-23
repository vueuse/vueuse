import { nextTick } from 'vue-demi'
import { useTimer } from '.'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(useTimer).toBeDefined()
  })

  it('should initiate timer', async () => {
    const { start, status, seconds } = useTimer(5, { controls: true })
    expect(status.value).toBe('STOPPED')
    start()
    vi.advanceTimersToNextTimer()
    await nextTick()
    expect(seconds.value).toBe(4)
    expect(status.value).toBe('RUNNING')
  })

  it('should initiate timer with immediate option', () => {
    const { status } = useTimer(5, { immediate: true, controls: true })
    expect(status.value).toBe('RUNNING')
  })

  it('should have finished status on time over', async () => {
    const { seconds, status } = useTimer(5, { immediate: true, controls: true })
    vi.runAllTimers()
    await nextTick()
    expect(seconds.value).toBe(0)
    expect(status.value).toBe('FINISHED')
  })

  it('should execute callback on timer end', () => {
    const mockFn = vi.fn()
    const { start } = useTimer(2, { onTimerEnd: mockFn, controls: true })
    start()
    vi.runAllTimers()
    expect(mockFn).toHaveBeenCalledOnce()
  })

  it('should pause timer', async () => {
    const mockFn = vi.fn()
    const { pause, status, seconds } = useTimer(5, { immediate: true, onTimerEnd: mockFn, controls: true })
    pause()
    vi.runAllTimers()
    await nextTick()
    expect(seconds.value).toBe(5)
    expect(mockFn).not.toHaveBeenCalled()
    expect(status.value).toBe('PAUSED')
  })

  it('should unpause timer when start is called', async () => {
    const { start, pause, status, seconds } = useTimer(5, { immediate: true, controls: true })
    pause()
    vi.advanceTimersByTime(2000)
    start()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(seconds.value).toBe(4)
    expect(status.value).toBe('RUNNING')
  })

  it('should restart timer after it is finished', async () => {
    const { start, seconds, status } = useTimer(5, { immediate: true, controls: true })
    vi.runAllTimers()
    start()
    await nextTick()
    expect(status.value).toBe('RUNNING')
    expect(seconds.value).toBe(5)
  })

  it('should reset timer', async () => {
    const { reset, seconds, status } = useTimer(5, { immediate: true, controls: true })
    vi.advanceTimersByTime(2000)
    reset()
    await nextTick()
    expect(status.value).toBe('STOPPED')
    expect(seconds.value).toBe(5)
  })

  it('should return correct timer value', async () => {
    const dayInSeconds = 86400
    const timer = useTimer(dayInSeconds, { immediate: true, format: 'hh:mm:ss' })
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(timer.value).toBe('23:59:59')
  })

  it('should return correct days value', async () => {
    const dayInSeconds = 86400
    const timer = useTimer(dayInSeconds, { format: 'DD:hh:mm:ss' })
    await nextTick()
    expect(timer.value).toBe('01:00:00:00')
  })
})
