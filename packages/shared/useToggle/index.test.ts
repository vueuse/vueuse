import { describe, expect, it } from 'vitest'
import { isRef, shallowRef, toValue } from 'vue'
import { useToggle } from './index'

describe('useToggle', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined()
  })

  it('default result', () => {
    const result = useToggle()
    const [value, toggle] = result
    const { value: value2, toggle: toggle2 } = result

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)

    expect(typeof toggle).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(false)

    expect(value2).toBe(value)
    expect(toggle2).toBe(toggle)

    expect(isRef(value2)).toBe(true)
    expect(toValue(value2)).toBe(false)
  })

  it('default result with initialValue', () => {
    const result = useToggle(true)
    const [value, toggle] = result
    const { value: value2, toggle: toggle2 } = result

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)

    expect(typeof toggle).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(true)

    expect(toggle2).toBe(toggle)
    expect(value2).toBe(value)

    expect(isRef(value2)).toBe(true)
    expect(toValue(value2)).toBe(true)
  })

  it('should toggle', () => {
    const result = useToggle()
    const [value, toggle] = result

    expect(toggle()).toBe(true)
    expect(toValue(value)).toBe(true)

    expect(toggle()).toBe(false)
    expect(toValue(value)).toBe(false)
  })

  it('should receive toggle param', () => {
    const result = useToggle()
    const [value, toggle] = result

    expect(toggle(false)).toBe(false)
    expect(toValue(value)).toBe(false)

    expect(toggle(true)).toBe(true)
    expect(toValue(value)).toBe(true)
  })

  it('ref initialValue', () => {
    const isDark = shallowRef(true)
    const toggle = useToggle(isDark)

    expect(typeof toggle).toBe('function')

    expect(toggle()).toBe(false)
    expect(toValue(isDark)).toBe(false)

    expect(toggle()).toBe(true)
    expect(toValue(isDark)).toBe(true)

    expect(toggle(false)).toBe(false)
    expect(toValue(isDark)).toBe(false)

    expect(toggle(true)).toBe(true)
    expect(toValue(isDark)).toBe(true)
  })

  it('should toggle with truthy & falsy', () => {
    const status = shallowRef('ON')
    const toggle = useToggle(status, {
      truthyValue: 'ON',
      falsyValue: 'OFF',
    })

    expect(toValue(status)).toBe('ON')
    expect(typeof toggle).toBe('function')

    expect(toggle()).toBe('OFF')
    expect(toValue(status)).toBe('OFF')

    expect(toggle()).toBe('ON')
    expect(toValue(status)).toBe('ON')

    expect(toggle('OFF')).toBe('OFF')
    expect(toValue(status)).toBe('OFF')

    expect(toggle('ON')).toBe('ON')
    expect(toValue(status)).toBe('ON')
  })

  it('should allow setting value via .value', () => {
    const result = useToggle()
    const [value] = result
    const { value: value2 } = result

    expect(toValue(value2)).toBe(false)

    value2.value = true
    expect(toValue(value2)).toBe(true)
    expect(toValue(value)).toBe(true)

    value2.value = false
    expect(toValue(value2)).toBe(false)
    expect(toValue(value)).toBe(false)
  })
})
