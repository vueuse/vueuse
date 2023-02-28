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

    syncRef(left, right, { direction: 'rtl' })

    expect(left.value).toBe('right')
    expect(right.value).toBe('right')

    left.value = 'bar'

    expect(left.value).toBe('bar')
    expect(right.value).toBe('right')

    right.value = 'foobar'

    expect(left.value).toBe('foobar')
    expect(right.value).toBe('foobar')
  })

  it('works with mutual convertors', () => {
    const left = ref(10)
    const right = ref(1)

    syncRef(left, right, {
      transform: {
        ltr: left => left * 2,
        rtl: right => Math.round(right / 2),
      },
    })

    // check immediately sync
    expect(right.value).toBe(20)
    expect(left.value).toBe(10)

    left.value = 30
    expect(right.value).toBe(60)
    expect(left.value).toBe(30)

    right.value = 10
    expect(right.value).toBe(10)
    expect(left.value).toBe(5)
  })

  it('works with only rtl convertor', () => {
    const left = ref(10)
    const right = ref(2)

    syncRef(left, right, {
      direction: 'rtl',
      transform: {
        rtl: right => Math.round(right / 2),
      },
    })

    // check immediately sync
    expect(right.value).toBe(2)
    expect(left.value).toBe(1)

    left.value = 10
    expect(right.value).toBe(2)
    expect(left.value).toBe(10)

    right.value = 10

    expect(right.value).toBe(10)
    expect(left.value).toBe(5)
  })
})
