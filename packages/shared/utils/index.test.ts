import { ref } from 'vue-demi'
import { createFilterWrapper, createSingletonPromise, debounceFilter, increaseWithUnit, objectPick, promiseTimeout, throttleFilter } from '.'

describe('utils', () => {
  it('increaseWithUnit', () => {
    expect(increaseWithUnit(100, 1)).toEqual(101)
    expect(increaseWithUnit('1px', 1)).toEqual('2px')
    expect(increaseWithUnit('-1em', 1)).toEqual('0em')
    expect(increaseWithUnit('1em', -1)).toEqual('0em')
    expect(increaseWithUnit('1em', -5)).toEqual('-4em')
    expect(increaseWithUnit('0.5vw', 1.5)).toEqual('2vw')
    expect(increaseWithUnit('100 %', 10)).toEqual('110 %')
    expect(increaseWithUnit('var(--cool)', -5)).toEqual('var(--cool)')
  })

  it('objectPick', () => {
    expect(objectPick({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toEqual({ a: 1, b: 2 })
    expect(objectPick({ a: 1, b: 2, c: undefined }, ['a', 'b'], true)).toEqual({ a: 1, b: 2 })
  })
})

describe('promise', () => {
  it('should promiseTimeout work', async () => {
    const num = ref(0)
    setTimeout(() => {
      num.value = 1
    }, 100)

    await promiseTimeout(100)

    expect(num.value).toBe(1)
  })

  it('should promiseTimeout throw timeout', async () => {
    await promiseTimeout(100, true).catch((error) => {
      expect(error).toBe('Timeout')
    })
  })

  it('should createSingletonPromise work', async () => {
    const createPromise = () => Promise.resolve(0)
    const wrapper = createSingletonPromise(createPromise)
    const promise1 = wrapper()
    const promise2 = wrapper()

    expect(promise1).toBe(promise2)
    const value = await promise1
    expect(value).toBe(0)
  })

  it('should createSingletonPromise reset', async () => {
    const cb = vi.fn()
    const createPromise = () => Promise.resolve(0).then(cb)
    const wrapper = createSingletonPromise(createPromise)
    const promise1 = wrapper()

    await wrapper.reset()
    expect(cb).toHaveBeenCalled()

    const promise2 = wrapper()
    expect(promise1).not.toBe(promise2)
  })
})

describe('filters', () => {
  beforeEach(() => {
    vitest.useFakeTimers()
  })

  it('should debounce', () => {
    const debouncedFilterSpy = vitest.fn()
    const filter = createFilterWrapper(debounceFilter(1000), debouncedFilterSpy)

    setTimeout(filter, 200)
    vitest.runAllTimers()

    setTimeout(filter, 500)
    vitest.advanceTimersByTime(500)
    expect(debouncedFilterSpy).toHaveBeenCalledOnce()
  })

  it('should debounce twice', () => {
    const debouncedFilterSpy = vitest.fn()
    const filter = createFilterWrapper(debounceFilter(500), debouncedFilterSpy)

    setTimeout(filter, 500)
    vitest.advanceTimersByTime(500)
    setTimeout(filter, 1000)
    vitest.advanceTimersByTime(2000)

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should debounce with ref', () => {
    const debouncedFilterSpy = vitest.fn()
    const debounceTime = ref(0)
    const filter = createFilterWrapper(debounceFilter(debounceTime), debouncedFilterSpy)

    filter()
    debounceTime.value = 500
    filter()
    setTimeout(filter, 200)

    vitest.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should throttle', () => {
    const debouncedFilterSpy = vitest.fn()
    const filter = createFilterWrapper(throttleFilter(1000), debouncedFilterSpy)

    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)

    vitest.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should throttle with ref', () => {
    const debouncedFilterSpy = vitest.fn()
    const throttle = ref(0)
    const filter = createFilterWrapper(throttleFilter(throttle), debouncedFilterSpy)

    filter()
    throttle.value = 1000

    setTimeout(filter, 300)
    setTimeout(filter, 600)
    setTimeout(filter, 900)

    vitest.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should not duplicate single event', () => {
    const debouncedFilterSpy = vitest.fn()
    const filter = createFilterWrapper(throttleFilter(1000), debouncedFilterSpy)

    setTimeout(filter, 500)

    vitest.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(1)
  })
})
