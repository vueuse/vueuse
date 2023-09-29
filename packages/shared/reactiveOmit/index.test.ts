import { isVue2, reactive } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { reactiveOmit } from '.'

interface TargetObject {
  foo: string
  bar: string
  baz?: string
  qux?: boolean
}

describe('reactiveOmit', () => {
  it('should work', () => {
    const source = reactive<TargetObject>({
      foo: 'foo',
      bar: 'bar',
    })

    const state = reactiveOmit(source, 'bar', 'baz')

    expect(state).toEqual({
      foo: 'foo',
    })

    if (isVue2)
      return

    source.qux = true

    expect(state).toEqual({
      foo: 'foo',
      qux: true,
    })

    source.baz = 'should be omit'

    expect(state).toEqual({
      foo: 'foo',
      qux: true,
    })

    // write back
    state.foo = 'foo2'
    expect(source).toMatchInlineSnapshot(`
      {
        "bar": "bar",
        "baz": "should be omit",
        "foo": "foo2",
        "qux": true,
      }
    `)

    expect(state).toMatchInlineSnapshot(`
      {
        "foo": "foo2",
        "qux": true,
      }
    `)
  })

  it('should work with predicate', () => {
    const source = reactive<TargetObject>({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
      qux: true,
    })

    const state = reactiveOmit(source, (value, key) => key === 'bar' || key === 'baz' || value === true)

    expect(state).toEqual({
      foo: 'foo',
    })

    source.qux = false

    expect(state).toEqual({
      foo: 'foo',
      qux: false,
    })
  })
})
