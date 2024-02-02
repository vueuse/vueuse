import { isVue3, ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { computedRef } from '.'

describe('computedRef', () => {
  it('should work', () => {
    const data = ref('foo')

    const state = computedRef(() => data.value.toUpperCase())

    expect(state.value).toBe('FOO')

    state.value = 'bar'

    expect(state.value).toBe('bar')

    data.value = 'baz'

    expect(state.value).toBe('BAZ')
  })

  it.runIf(isVue3)('custom trigger', () => {
    const data = ref('foo')

    const state = computedRef(() => data.value.toUpperCase())

    expect(state.value).toBe('FOO')

    state.value = 'bar'

    expect(state.value).toBe('bar')

    state.trigger()

    expect(state.value).toBe('FOO')
  })
})
