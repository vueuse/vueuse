import { isVue3, ref } from 'vue-demi'
import { __onlyVue3, assert, clamp, createFilterWrapper, createSingletonPromise, debounceFilter, directiveHooks, hasOwn, increaseWithUnit, isBoolean, isClient, isDef, isFunction, isIOS, isNumber, isObject, isString, isWindow, noop, now, objectPick, promiseTimeout, rand, throttleFilter, timestamp } from '.'

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

  it('should resolve & reject debounced fn', async () => {
    const debouncedSum = createFilterWrapper(
      debounceFilter(500, { rejectOnCancel: true }),
      (a: number, b: number) => a + b,
    )

    const five = debouncedSum(2, 3)
    let nine
    setTimeout(() => {
      nine = debouncedSum(4, 5)
    }, 200)

    vitest.runAllTimers()

    await expect(five).rejects.toBeUndefined()
    await expect(nine).resolves.toBe(9)
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
    const throttledFilterSpy = vitest.fn()
    const filter = createFilterWrapper(throttleFilter(1000), throttledFilterSpy)

    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500)

    vitest.runAllTimers()

    expect(throttledFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should throttle evenly', () => {
    const debouncedFilterSpy = vitest.fn()

    const filter = createFilterWrapper(throttleFilter(1000), debouncedFilterSpy)

    setTimeout(() => filter(1), 500)
    setTimeout(() => filter(2), 1000)
    setTimeout(() => filter(3), 2000)

    vitest.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(3)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(1)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(2)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(3)
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

  it('should get trailing value', () => {
    const sumSpy = vitest.fn((a: number, b: number) => a + b)
    const throttledSum = createFilterWrapper(
      throttleFilter(1000, true),
      sumSpy,
    )

    let result = throttledSum(2, 3)
    setTimeout(() => {
      result = throttledSum(4, 5)
    }, 600)
    setTimeout(() => {
      result = throttledSum(6, 7)
    }, 900)

    vitest.runAllTimers()

    expect(sumSpy).toHaveBeenCalledTimes(2)
    expect(result).resolves.toBe(6 + 7)

    setTimeout(() => {
      result = throttledSum(8, 9)
    }, 1200)
    setTimeout(() => {
      result = throttledSum(10, 11)
    }, 1800)

    vitest.runAllTimers()

    expect(sumSpy).toHaveBeenCalledTimes(4)
    expect(result).resolves.toBe(10 + 11)
  })

  it('should get leading value', () => {
    const sumSpy = vitest.fn((a: number, b: number) => a + b)
    const throttledSum = createFilterWrapper(
      throttleFilter(1000, false),
      sumSpy,
    )

    let result = throttledSum(2, 3)
    setTimeout(() => {
      result = throttledSum(4, 5)
    }, 600)
    setTimeout(() => {
      result = throttledSum(6, 7)
    }, 900)

    vitest.runAllTimers()

    expect(sumSpy).toHaveBeenCalledTimes(1)
    expect(result).resolves.toBe(2 + 3)

    setTimeout(() => {
      result = throttledSum(8, 9)
    }, 1200)
    setTimeout(() => {
      result = throttledSum(10, 11)
    }, 1800)

    vitest.runAllTimers()

    expect(sumSpy).toHaveBeenCalledTimes(2)
    expect(result).resolves.toBe(8 + 9)
  })
})

describe('is', () => {
  beforeEach(() => {
    console.warn = vi.fn()
  })

  it('should be boolean', () => {
    expect(isBoolean(true)).toBeTruthy()
    expect(isBoolean(false)).toBeTruthy()
    expect(0).toBeFalsy()
    expect('').toBeFalsy()
  })

  it('should be client', () => {
    expect(isClient).toBeTruthy()
  })

  it('should be IOS', () => {
    expect(isIOS).toBeFalsy()
  })

  it('should assert', () => {
    assert(true)
    expect(console.warn).not.toBeCalled()
    assert(false, 'error')
    expect(console.warn).toHaveBeenCalledWith('error')
  })

  it('should be defined', () => {
    expect(isDef(null)).toBeTruthy()
    expect(isDef(0)).toBeTruthy()
    expect(isDef('')).toBeTruthy()
    expect(isDef(undefined)).toBeFalsy()
  })

  it('should be function', () => {
    expect(isFunction(() => {})).toBeTruthy()
    expect(isFunction(() => {})).toBeTruthy()
  })

  it('should be number', () => {
    expect(isNumber(1)).toBeTruthy()
    expect(isNumber('1')).toBeFalsy()
  })

  it('should be string', () => {
    expect(isString('')).toBeTruthy()
    expect(isString(0)).toBeFalsy()
  })

  it('should be object', () => {
    expect(isObject({})).toBeTruthy()
    expect(isObject(null)).toBeFalsy()
    expect(isObject([])).toBeFalsy()
  })

  it('should be window', () => {
    // Object.prototype.toString.call(window) is '[object global]'
    expect(isWindow(window)).toBeFalsy()
    expect(isWindow({})).toBeFalsy()
  })

  it('should be now', () => {
    expect(now()).toEqual(Date.now())
    expect(timestamp()).toEqual(Date.now())
  })

  it('should clamp', () => {
    expect(clamp(1, 2, 3)).toBe(2)
    expect(clamp(2, 1, 3)).toBe(2)
  })

  it('should noop', () => {
    expect(noop()).toBeUndefined()
  })

  it('should be rand', () => {
    expect(rand(1, 2)).not.toBe(rand(1, 2))
  }, { retry: 20 })

  it('should be rand', () => {
    class Parent {a = 1}
    class Child extends Parent {}
    function F() {}
    F.prototype.a = 1
    const obj1 = { a: 1 } as any
    const obj2 = new Child() as any
    // @ts-expect-error ES5 new
    const obj3 = new F() as any
    expect(hasOwn(obj1, 'a')).toBeTruthy()
    expect(hasOwn(obj1, 'b')).toBeFalsy()
    expect(hasOwn(obj2, 'a')).toBeTruthy()
    expect(hasOwn(obj2, 'b')).toBeFalsy()
    expect(hasOwn(obj3, 'a')).toBeFalsy()

    obj3.a = 2
    expect(hasOwn(obj3, 'a')).toBeTruthy()
  })
})

describe('compatibility', () => {
  it('should export module', () => {
    expect(__onlyVue3).toBeDefined()
    expect(directiveHooks).toBeDefined()
  })

  it('__onlyVues', () => {
    if (isVue3) {
      expect(__onlyVue3()).toBeUndefined()
    }
    else {
      expect(() => __onlyVue3()).toThrowError('[VueUse] this function is only works on Vue 3.')
      expect(() => __onlyVue3('func')).toThrowError('[VueUse] func is only works on Vue 3.')
    }
  })

  it('directiveHooks', () => {
    if (isVue3) {
      expect(directiveHooks).toEqual({
        mounted: 'mounted',
        updated: 'updated',
        unmounted: 'unmounted',
      })
    }
    else {
      expect(directiveHooks).toEqual({
        mounted: 'inserted',
        updated: 'componentUpdated',
        unmounted: 'unbind',
      })
    }
  })
})
