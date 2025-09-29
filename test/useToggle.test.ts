import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { useToggle } from '../packages/shared/useToggle'

describe('useToggle', () => {
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
