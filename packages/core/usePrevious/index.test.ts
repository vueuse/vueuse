import { useCounter } from '@vueuse/shared'
import { usePrevious } from '../usePrevious'

describe('usePrevious', () => {
  it('should be defined', () => {
    expect(usePrevious).toBeDefined()
  })

  it('should be update previous value', () => {
    const { count, inc, dec } = useCounter()
    const previous = usePrevious(count)

    expect(count.value).toBe(0)
    expect(previous.value).toBeUndefined()
    inc()
    expect(previous.value).toBe(0)
    inc()
    expect(previous.value).toBe(1)
    inc()
    expect(previous.value).toBe(2)
    dec()
    expect(previous.value).toBe(3)
    dec()
    expect(previous.value).toBe(2)
    dec()
    expect(previous.value).toBe(1)
    dec()
    expect(previous.value).toBe(0)
  })
})
