import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { isDefined } from './index'

describe('isDefined', () => {
  it('should be defined', () => {
    expect(isDefined).toBeDefined()
  })

  it('should support refs', () => {
    const definedRef = shallowRef('test')
    const undefinedRef = shallowRef(undefined)
    const nullRef = shallowRef(null)

    expect(isDefined(definedRef)).toBe(true)
    expect(isDefined(undefinedRef)).toBe(false)
    expect(isDefined(nullRef)).toBe(false)
  })

  it('should support computed refs', () => {
    const definedComputed = computed(() => 'test')
    const undefinedComputed = computed(() => undefined)
    const nullComputed = computed(() => null)

    expect(isDefined(definedComputed)).toBe(true)
    expect(isDefined(undefinedComputed)).toBe(false)
    expect(isDefined(nullComputed)).toBe(false)
  })

  it('should support values', () => {
    const definedValue = 'test'
    const undefinedValue = undefined
    const nullValue = null

    expect(isDefined(definedValue)).toBe(true)
    expect(isDefined(undefinedValue)).toBe(false)
    expect(isDefined(nullValue)).toBe(false)
  })
})
