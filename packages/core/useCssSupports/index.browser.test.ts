import { useCssSupports } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'

describe('useCssSupports', () => {
  it('should be defined', () => {
    expect(useCssSupports).toBeDefined()
  })

  it('should correctly support existing features', () => {
    const { isSupported: textDecoration } = useCssSupports('text-decoration-style', 'blink')
    const { isSupported: flex } = useCssSupports('display: flex')
    const { isSupported: variable } = useCssSupports('(--foo: red)')
    const { isSupported: selectorHas } = useCssSupports('selector(:has(a))')
    const { isSupported: query } = useCssSupports('(transform-style: preserve) or (-moz-transform-style: preserve) or (-webkit-transform-style: preserve)')
    const { isSupported: doesNotExists } = useCssSupports('doesNotExist')

    expect(textDecoration.value).toBe(false)
    expect(flex.value).toBe(true)
    expect(variable.value).toBe(true)
    expect(selectorHas.value).toBe(true)
    expect(query.value).toBe(false)
    expect(doesNotExists.value).toBe(false)
  })

  it('should reactively update if prop or value changes', () => {
    const prop = shallowRef('display: flex')
    const { isSupported } = useCssSupports(prop)
    expect(isSupported.value).toBe(true)
    prop.value = 'e18e is important, but not supported'
    expect(isSupported.value).toBe(false)
  })
})
