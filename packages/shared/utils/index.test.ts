import { nextTick, ref } from 'vue-demi'
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
  beforeEach(() => jest.useFakeTimers('legacy'))
  afterEach(() => jest.clearAllTimers())

  it('should debounce', () => {
    let called = 0
    const filter = createFilterWrapper(debounceFilter(1000), () => called++)

    setTimeout(filter, 200)
    setTimeout(filter, 500)

    jest.runAllTimers()

    expect(called).toBe(1)
  })

  it('should debounce twice', () => {
    let called = 0
    const filter = createFilterWrapper(debounceFilter(500), () => called++)

    setTimeout(filter, 500)
    setTimeout(filter, 1000)

    jest.runAllTimers()

    expect(called).toBe(2)
  })

  it('should debounce with ref', () => {
    const debounceTime = ref(0)

    let called = 0
    const filter = createFilterWrapper(debounceFilter(debounceTime), () => called++)

    filter()
    debounceTime.value = 500
    filter()
    setTimeout(filter, 200)

    jest.runAllTimers()

    expect(called).toBe(2)
  })

  it('should throttle', () => {
    let called = 0
    const filter = createFilterWrapper(throttleFilter(1000), () => called++)

    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)

    jest.runAllTimers()

    expect(called).toBe(2)
  })

  it('should throttle', () => {
    let called = 0
    const filter = createFilterWrapper(throttleFilter(1000), () => called++)

    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)

    jest.runAllTimers()

    expect(called).toBe(2)
  })

  it('should throttle with ref', async() => {
    const throttle = ref(0)
    let called = 0
    const filter = createFilterWrapper(throttleFilter(throttle), () => called++)

    filter()
    throttle.value = 1000
    await nextTick()
    setTimeout(filter, 300)
    setTimeout(filter, 600)
    setTimeout(filter, 900)

    jest.runAllTimers()

    expect(called).toBe(2)
  })
})
