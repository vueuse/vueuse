import { describe, expect, it } from 'vitest'
import { ref as deepRef, guardReactiveProps, isReactive, normalizeProps, reactive, shallowReadonly, toRefs, watchSyncEffect } from 'vue'
import { reactiveOmit } from './index'

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

  it('should be reactive', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    expect(isReactive(state)).toBe(true)
  })

  it('should track keys added to the source later', () => {
    const source = reactive<TargetObject>({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    const keys: string[][] = []
    watchSyncEffect(() => keys.push(Object.keys(state)))

    expect(keys.at(-1)).toEqual(['foo'])

    source.qux = true

    expect(keys.at(-1)).toEqual(['foo', 'qux'])
  })

  it('should enumerate only non-omitted own keys', () => {
    const source = reactive({ foo: 'foo', bar: 'bar', baz: 'baz' })
    const state = reactiveOmit(source, 'bar')

    expect(Object.keys(state)).toEqual(['foo', 'baz'])
    expect({ ...state }).toEqual({ foo: 'foo', baz: 'baz' })
  })

  it('should read inherited properties from the source', () => {
    const source = reactive(Object.assign(Object.create({ toString: () => 'custom' }), { foo: 'foo', bar: 'bar' }))
    const state = reactiveOmit(source, 'bar')

    expect(String(state)).toBe('custom')
  })

  it('should call source getters with the source as `this`', () => {
    const source = reactive({
      first: 'a',
      last: 'b',
      get full() {
        return this.first + this.last
      },
    })
    const state = reactiveOmit(source, 'first')

    expect(state.full).toBe('ab')
  })

  it('should not let `v-bind` normalization write to a plain source', () => {
    const source = { class: ['a', { b: true }], bar: 'bar' }
    const state = reactiveOmit(source, 'bar')

    normalizeProps(guardReactiveProps(state))

    expect(source.class).toEqual(['a', { b: true }])
  })

  it('should keep omitting keys and tracking the source when stored in a reactive container', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const container = reactive<Record<string, any>>({})
    container.state = reactiveOmit(source, 'bar')

    expect(Object.keys(container.state)).toEqual(['foo'])
    expect(container.state.bar).toBeUndefined()

    const values: string[] = []
    watchSyncEffect(() => values.push(container.state.foo))

    source.foo = 'foo2'

    expect(values.at(-1)).toBe('foo2')

    container.state.foo = 'foo3'

    expect(values.at(-1)).toBe('foo3')
    expect(source.foo).toBe('foo3')
  })

  it('should support omitting non-configurable keys', () => {
    const source = Object.defineProperty({ foo: 'foo' } as Record<string, string>, 'bar', { value: 'bar', enumerable: true })
    const state = reactiveOmit(source, 'bar')

    expect(Object.keys(state)).toEqual(['foo'])
    expect('bar' in state).toBe(false)
  })

  it('should support sources with non-configurable symbols', () => {
    const source = Object.defineProperty({ foo: 'foo', bar: 'bar' }, Symbol('baz'), { value: 'baz' })
    const state = reactiveOmit(source, 'bar')

    expect(Object.keys(state)).toEqual(['foo'])
    expect({ ...state }).toEqual({ foo: 'foo' })
  })

  it('should read non-writable refs in the source', () => {
    const source = Object.defineProperty({ bar: 'bar' } as Record<string, unknown>, 'foo', { value: deepRef('foo'), enumerable: true })
    const state = reactiveOmit(source, 'bar')

    expect(state.foo).toBe('foo')
  })

  it('should support `hasOwnProperty` calls', () => {
    const source = reactive<TargetObject>({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    const results: boolean[] = []
    // eslint-disable-next-line e18e/prefer-object-has-own, no-prototype-builtins
    watchSyncEffect(() => results.push(state.hasOwnProperty('foo'), state.hasOwnProperty('bar'), state.hasOwnProperty('qux')))

    expect(results).toEqual([true, false, false])

    source.qux = true

    expect(results.slice(3)).toEqual([true, false, true])
  })

  it('should omit numeric keys', () => {
    const source = reactive<Record<number, string>>({ 1: 'a', 2: 'b' })
    const state = reactiveOmit(source, 1)

    expect(Object.keys(state)).toEqual(['2'])
    expect(state[1]).toBeUndefined()
  })

  it('should not define omitted keys on the source', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    Object.defineProperty(state, 'bar', { value: 'bar2', configurable: true, enumerable: true, writable: true })

    expect(source.bar).toBe('bar')
  })

  it('should support frozen sources', () => {
    const source = Object.freeze({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    expect(Object.keys(state)).toEqual(['foo'])
    expect((state as any).bar).toBeUndefined()
  })

  it('should support toRefs', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')
    const refs = toRefs(state)

    expect(Object.keys(refs)).toEqual(['foo'])
    expect(refs.foo.value).toBe('foo')

    source.foo = 'foo2'

    expect(refs.foo.value).toBe('foo2')
  })

  it('should delete through to the source', () => {
    const source = reactive<TargetObject>({ foo: 'foo', bar: 'bar', baz: 'baz' })
    const state = reactiveOmit(source, 'bar') as Partial<TargetObject>

    delete state.foo
    delete state.bar

    expect(source).toEqual({ bar: 'bar', baz: 'baz' })
    expect(state.foo).toBeUndefined()
    expect(Object.keys(state)).toEqual(['baz'])
  })

  it('should read and write through to refs in the source', () => {
    const source = { foo: deepRef('foo'), bar: 'bar' }
    const state = reactiveOmit(source, 'bar') as unknown as { foo: string }

    expect(state.foo).toBe('foo')

    state.foo = 'foo2'

    expect(source.foo.value).toBe('foo2')
  })

  it('should read through readonly props', () => {
    const props = shallowReadonly({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(props, 'bar')

    expect(state.foo).toBe('foo')
    expect(Object.keys(state)).toEqual(['foo'])
  })

  it('should not expose symbol keys', () => {
    const symbol = Symbol('foo')
    const source = reactive({ foo: 'foo' }) as Record<PropertyKey, unknown>
    source[symbol] = 'bar'

    const state = reactiveOmit(source)

    expect(Object.keys(state)).toEqual(['foo'])
    expect(symbol in state).toBe(false)
    expect((state as any)[symbol]).toBeUndefined()
  })

  it('should support `in` checks', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    expect('foo' in state).toBe(true)
    expect('bar' in state).toBe(false)
    expect('baz' in state).toBe(false)
  })

  it('should not report descriptors for omitted keys', () => {
    const source = reactive({ foo: 'foo', bar: 'bar' })
    const state = reactiveOmit(source, 'bar')

    expect(Object.getOwnPropertyDescriptor(state, 'foo')).toMatchObject({
      enumerable: true,
      configurable: true,
    })
    expect(Object.getOwnPropertyDescriptor(state, 'bar')).toBeUndefined()
    expect(Object.hasOwn(state, 'bar')).toBe(false)
  })
})
