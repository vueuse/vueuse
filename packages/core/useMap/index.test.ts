import { useMap } from '.'

describe('useMap', () => {
  it('should work', async() => {
    const { size, keys, values, get, set, has, setAll, remove, reset } = useMap({ a: 1, b: 2 })
    // size
    expect(size.value).toBe(2)

    // keys
    expect(keys.value.next().value).toBe('a')

    // values
    expect(values.value.next().value).toBe(1)

    // get should work
    expect(get('a')).toBe(1)

    // set should work
    set('a', 3)
    expect(get('a')).toBe(3)

    // has should work
    expect(has('a')).toBe(true)
    expect(has('c')).toBe(false)

    // setAll should work
    expect(setAll({ c: 3 }))
    expect(get('a')).toBe(undefined)
    expect(get('c')).toBe(3)
    expect(keys.value.next().value).toBe('c')

    // remove should work
    remove()
    expect(keys.value.next().value).toBe(undefined)
    expect(values.value.next().value).toBe(undefined)

    // reset should work
    reset()
    expect(get('a')).toBe(1)
    expect(get('b')).toBe(2)
  })

  it('should work w/ initial values (array)', () => {
    const { get, size } = useMap([['a', 1], ['b', 2]])
    expect(get('a')).toBe(1)
    expect(get('b')).toBe(2)
    expect(size.value).toBe(2)
  })
})
