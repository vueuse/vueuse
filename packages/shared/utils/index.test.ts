import { ref } from 'vue-demi'
import { createFilterWrapper, debounceFilter, increaseWithUnit, throttleFilter } from '.'

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
})
