import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'

import { useLens } from './index'

describe('useLens', () => {
  it('accesses and modifies a nested property', () => {
    const source = shallowRef({ profile: { name: 'Alice' } })
    const name = useLens(source, s => s.profile.name)
    expect(name.value).toBe('Alice')
    name.value = 'Bob'
    expect(source.value.profile.name).toBe('Bob')
  })

  it('works with Ref source', () => {
    const source = deepRef({ profile: { name: 'Charlie' } })
    const name = useLens(source, s => s.profile.name)
    expect(name.value).toBe('Charlie')
    name.value = 'Dave'
    expect(source.value.profile.name).toBe('Dave')
  })

  it('transforms value on get and set', () => {
    const source = deepRef({ count: '42' })
    const count = useLens(source, s => s.count, {
      transform: v => Number.parseInt(v),
      onSet: v => v.toString(),
    })
    expect(count.value).toBe(42)
    expect(typeof count.value).toBe('number')
    count.value = 50
    expect(source.value.count).toBe('50')
  })

  it('throws error for non-reactive source', () => {
    const source = { profile: { name: 'Alice' } }
    expect(() => useLens(source, s => s.profile.name)).toThrowError(
      '"source" must be a Ref or a reactive object.',
    )
  })

  it('throws error for invalid selector', () => {
    const source = deepRef({ profile: { name: 'Alice' } })
    expect(() => useLens(source, () => {})).toThrowError(
      'Selector must specify a valid path.',
    )
  })
})
