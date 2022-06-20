import { expect } from 'vitest'
import { isRef, ref, unref } from 'vue-demi'
import { useToggle } from '.'

describe('useToggle', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined()
  })

  it('default result', () => {
    const result = useToggle()
    const [value, toggle, setTrue, setFalse] = result

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(4)

    expect(typeof toggle).toBe('function')
    expect(typeof setTrue).toBe('function')
    expect(typeof setFalse).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(unref(value)).toBe(false)
  })

  it('default result with initialValue', () => {
    const result = useToggle(true)
    const [value, toggle, setTrue, setFalse] = result

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(4)

    expect(typeof toggle).toBe('function')
    expect(typeof setTrue).toBe('function')
    expect(typeof setFalse).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(unref(value)).toBe(true)
  })

  it('should toggle', () => {
    const result = useToggle()
    const [value, toggle] = result

    expect(toggle()).toBe(true)
    expect(unref(value)).toBe(true)

    expect(toggle()).toBe(false)
    expect(unref(value)).toBe(false)
  })

  it('should receive toggle param', () => {
    const result = useToggle()
    const [value, toggle] = result

    expect(toggle(false)).toBe(false)
    expect(unref(value)).toBe(false)

    expect(toggle(true)).toBe(true)
    expect(unref(value)).toBe(true)
  })

  it('ref initialValue', () => {
    const isDark = ref(true)
    const toggle = useToggle(isDark)

    expect(typeof toggle).toBe('function')

    expect(toggle()).toBe(false)
    expect(unref(isDark)).toBe(false)

    expect(toggle()).toBe(true)
    expect(unref(isDark)).toBe(true)

    expect(toggle(false)).toBe(false)
    expect(unref(isDark)).toBe(false)

    expect(toggle(true)).toBe(true)
    expect(unref(isDark)).toBe(true)
  })

  it('should toggle with truthy & falsy', () => {
    const status = ref('ON')
    const toggle = useToggle(status, {
      truthyValue: 'ON',
      falsyValue: 'OFF',
    })

    expect(unref(status)).toBe('ON')
    expect(typeof toggle).toBe('function')

    expect(toggle()).toBe('OFF')
    expect(unref(status)).toBe('OFF')

    expect(toggle()).toBe('ON')
    expect(unref(status)).toBe('ON')

    expect(toggle('OFF')).toBe('OFF')
    expect(unref(status)).toBe('OFF')

    expect(toggle('ON')).toBe('ON')
    expect(unref(status)).toBe('ON')
  })

  it('should work with accurate toggle with not ref initial value', () => {
    const variants = {
      truthyValue: 'on',
      falsyValue: 'off',
    }

    const [status, toggle, setTruthy, setFalsy] = useToggle(variants.falsyValue, variants)

    expect(status.value).toBe(variants.falsyValue)

    setTruthy()
    expect(status.value).toBe(variants.truthyValue)

    setFalsy()
    expect(status.value).toBe(variants.falsyValue)

    toggle()
    expect(status.value).toBe(variants.truthyValue)

    toggle()
    expect(status.value).toBe(variants.falsyValue)
  })
})
