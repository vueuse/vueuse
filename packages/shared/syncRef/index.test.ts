import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
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
    const right = ref(2)

    syncRef(left, right, {
      transform: {
        ltr: left => left * 2,
        rtl: right => Math.floor(right / 3),
      },
    })

    // check immediately sync
    expect(right.value).toBe(20)
    expect(left.value).toBe(6)

    left.value = 30
    expect(right.value).toBe(60)
    expect(left.value).toBe(30)

    right.value = 10
    expect(right.value).toBe(10)
    expect(left.value).toBe(3)
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

  it('ts works', () => {
    const ref0 = ref(0)
    const ref1 = ref(1)
    const refString = ref('1')
    const refNumber = ref(1)
    const refNumString = ref<number | string>(1)
    const refNumBoolean = ref<number | boolean>(1)
    // L = A && direction === 'both'
    syncRef(ref0, ref1)()
    syncRef(ref0, ref1, {
      direction: 'both',
    })()
    syncRef(ref0, ref1, {
      direction: 'both',
      transform: {},
    })()
    syncRef(ref0, ref1, {
      direction: 'both',
      transform: {
        ltr: v => v,
      },
    })()
    syncRef(ref0, ref1, {
      direction: 'both',
      transform: {
        rtl: v => v,
      },
    })()
    syncRef(ref0, ref1, {
      direction: 'both',
      transform: {
        ltr: v => v,
        rtl: v => v,
      },
    })()
    syncRef(ref0, ref1, {
      direction: 'both',
      transform: {
        // @ts-expect-error wrong type, should be (left: L) => R
        ltr: v => v.toString(),
        rtl: v => v,
      },
    })()
    // L = A && direction === 'ltr'
    syncRef(ref0, ref1, {
      direction: 'ltr',
    })()
    syncRef(ref0, ref1, {
      direction: 'ltr',
      transform: {},
    })()
    syncRef(ref0, ref1, {
      direction: 'ltr',
      transform: {
        ltr: v => v,
      },
    })()
    syncRef(ref0, ref1, {
      direction: 'ltr',
      transform: {
      // @ts-expect-error wrong transform type, should be ltr
        rtl: v => v,
      },
    })()
    // L = A && direction === 'rtl'
    syncRef(ref0, ref1, {
      direction: 'rtl',
    })()
    syncRef(ref0, ref1, {
      direction: 'rtl',
      transform: {},
    })()
    syncRef(ref0, ref1, {
      direction: 'rtl',
      transform: {
        rtl: v => v,
      },
    })()
    // L ⊆ R && direction === 'both'
    // @ts-expect-error wrong type, should provide transform
    syncRef(ref0, refNumString, {
      direction: 'both',
    })()
    syncRef(ref0, refNumString, {
      direction: 'both',
      transform: {
        ltr: v => v.toString(),
        rtl: v => Number(v),
      },
    })()
    // L ⊆ R && direction === 'ltr'
    syncRef(ref0, refNumString, {
      direction: 'ltr',
      transform: {
        ltr: v => v.toString(),
      },
    })()
    // L ⊆ R && direction === 'rtl'
    syncRef(ref0, refNumString, {
      direction: 'ltr',
      transform: {
        ltr: v => Number(v),
      },
    })()
    // L ∩ R = ∅ && direction === 'both'
    syncRef(ref0, refString, {
      direction: 'both',
      transform: {
        ltr: v => v.toString(),
        rtl: v => Number(v),
      },
    })()
    // L ∩ R = ∅ && direction === 'ltr'
    syncRef(ref0, refString, {
      direction: 'ltr',
      transform: {
        ltr: v => v.toString(),
      },
    })()
    // L ∩ R = ∅ && direction === 'rtl'
    syncRef(ref0, refString, {
      direction: 'rtl',
      transform: {
        rtl: v => Number(v),
      },
    })()
    // L ∩ R = ∅ && direction === 'both'
    syncRef(ref0, refString, {
      direction: 'both',
      // @ts-expect-error wrong type, should provide ltr
      transform: {
        rtl: v => Number(v),
      },
    })()
    // L ∩ R ≠ ∅
    syncRef(refNumString, refNumBoolean, {
      transform: {
        ltr: v => Number(v),
        rtl: v => Number(v),
      },
    })

    // @ts-expect-error lack of options
    syncRef(ref0, refString)()

    syncRef(ref0, refNumBoolean, {
      direction: 'ltr',
    })()

    syncRef(refNumBoolean, ref0, {
      direction: 'rtl',
    })

    const bool0 = ref(false)
    const bool1 = ref(false)
    syncRef(bool0, bool1)

    syncRef(refNumber, refString, {
      // @ts-expect-error lack rtl func
      transform: {
        ltr: v => String(v),
      },
    })
  })
})
