import { useCssSupports } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'

describe('useCssSupports', () => {
  it('should be defined', () => {
    expect(useCssSupports).toBeDefined()
  })

  it('should correctly support existing features', () => {
    const { isSupported: textDecoration } = useCssSupports('text-decoration-style', 'blink')
    const { isSupported: transformOrigin } = useCssSupports('transform-origin', '5%')
    const { isSupported: flex } = useCssSupports('display: flex')
    const { isSupported: variable } = useCssSupports('(--foo: red)')
    const { isSupported: selectorHas } = useCssSupports('selector(:has(a))')
    const { isSupported: query } = useCssSupports('(transform-style: preserve) or (-moz-transform-style: preserve) or (-webkit-transform-style: preserve)')
    const { isSupported: doesNotExists } = useCssSupports('doesNotExist')

    expect(textDecoration.value).toBe(false)
    expect(transformOrigin.value).toBe(true)
    expect(flex.value).toBe(true)
    expect(variable.value).toBe(true)
    expect(selectorHas.value).toBe(true)
    expect(query.value).toBe(false)
    expect(doesNotExists.value).toBe(false)
  })

  it('should reactively update if condition, prop or value changes', () => {
    const condition = shallowRef('display: flex')
    const { isSupported } = useCssSupports(condition)
    expect(isSupported.value).toBe(true)
    condition.value = 'e18e'
    expect(isSupported.value).toBe(false)
    const prop = shallowRef('transform-origin')
    const value = shallowRef('5%')
    const { isSupported: variable } = useCssSupports(prop, value)
    expect(variable.value).toBe(true)
    value.value = 'e18e'
    expect(variable.value).toBe(false)
    value.value = '5%'
    expect(variable.value).toBe(true)
    prop.value = 'e18e'
    expect(variable.value).toBe(false)
  })

  it('should not treat conditionText as prop when options is set and value is undefined', () => {
    expect(useCssSupports('display: flex').isSupported.value).toBe(true)
    expect(useCssSupports('display: flex', {}).isSupported.value).toBe(true)
  })
})
