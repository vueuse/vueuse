import { reactive } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { reactivePick } from '../reactivePick'

describe('reactivePick', () => {
  it('should be defined', () => {
    expect(reactivePick).toBeDefined()
  })

  it('should work', () => {
    const source = reactive({
      foo: 'foo',
      bar: 'bar',
    })
    const state = reactivePick(source, 'bar')

    expect(state).toEqual({
      bar: 'bar',
    })

    source.foo = 'foo2'

    expect(state).toEqual({
      bar: 'bar',
    })

    source.bar = 'bar1'

    expect(state).toEqual({
      bar: 'bar1',
    })
  })

  it('should write back', () => {
    const source = reactive({
      foo: 'foo',
      bar: 'bar',
    })
    const state = reactivePick(source, 'bar')

    state.bar = 'bar2'

    expect(source).toEqual({
      foo: 'foo',
      bar: 'bar2',
    })
  })
  it('should work with predicate', () => {
    const source = reactive({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
      qux: true,
    })
    const state = reactivePick(source, (value, key) => {
      return key !== 'bar' && value !== true
    })

    expect(state).toEqual({
      foo: 'foo',
      baz: 'baz',
    })

    source.foo = 'foo2'

    expect(state).toEqual({
      foo: 'foo2',
      baz: 'baz',
    })

    source.bar = 'bar1'

    expect(state).toEqual({
      foo: 'foo2',
      baz: 'baz',
    })

    source.qux = false
    expect(state).toEqual({
      foo: 'foo2',
      baz: 'baz',
      qux: false,
    })
  })
})
