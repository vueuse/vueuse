import { reactive, ref, watch } from 'vue-demi'
import { set } from '.'

describe('set', () => {
  it('set ref', () => {
    const source = ref('foo')

    expect(source.value).toBe('foo')

    set(source, 'bar')

    expect(source.value).toBe('bar')
  })

  it('set reactive', () => {
    let changed = 0
    const source = reactive<{ foo: string; bar?: number }>({ foo: 'bar' })

    watch(source, () => changed += 1, { deep: true, flush: 'sync' })

    expect(source.foo).toBe('bar')

    set(source, 'foo', 'bar2')

    expect(source.foo).toBe('bar2')
    expect(changed).toBe(1)

    set(source, 'bar', 42)

    expect(source.bar).toBe(42)
    expect(changed).toBe(2)
  })
})
