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

    expect(typeof toggle).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(false)
  })

  it('default result with initialValue', () => {
    const result = useToggle(true)
    const [value, toggle] = result

    expect(typeof toggle).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(true)
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

  it('should toggle primitive boolean via array destructuring', () => {
    const [state, toggle] = useToggle()
    expect(state.value).toBe(false)
    toggle()
    expect(state.value).toBe(true)
    toggle(false)
    expect(state.value).toBe(false)
  })

  it('should support object destructuring access', () => {
    const { state, toggle } = useToggle(true)
    expect(state.value).toBe(true)
    toggle()
    expect(state.value).toBe(false)
  })

  it('should return a function when passing a ref', () => {
    const r = shallowRef(false)
    const toggle = useToggle(r)
    toggle()
    expect(r.value).toBe(true)
  })

  it('should respect custom truthy/falsy values', () => {
    const { state, toggle } = useToggle<'ON' | 'OFF', 'OFF' | 'ON', string>('OFF' as any, { truthyValue: 'ON', falsyValue: 'OFF' }) as any
    expect(state.value).toBe('OFF')
    toggle()
    expect(state.value).toBe('ON')
    toggle()
    expect(state.value).toBe('OFF')
  })
})
