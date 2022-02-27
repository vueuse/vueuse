import { ref } from 'vue-demi'
import { syncRef } from '.'

describe('syncRef', () => {
  it('should work', () => {
    const a = ref('foo')
    const b = ref('bar')

    const stop = syncRef(a, b)

    expect(b.value).toBe('foo')

    a.value = 'bar'

    expect(a.value).toBe('bar')
    expect(b.value).toBe('bar')

    b.value = 'foo'

    expect(a.value).toBe('foo')
    expect(b.value).toBe('foo')

    stop()

    a.value = 'bar2'

    expect(a.value).toBe('bar2')
    expect(b.value).toBe('foo')
  })

  it('trl', () => {
    const left = ref('left')
    const right = ref('right')

    const stop = syncRef(left, right, { direction: 'rtl' })

    expect(left.value).toBe('right')
    expect(right.value).toBe('right')

    left.value = 'bar'

    expect(left.value).toBe('bar')
    expect(right.value).toBe('right')

    right.value = 'foobar'

    expect(left.value).toBe('foobar')
    expect(right.value).toBe('foobar')
  })
})
