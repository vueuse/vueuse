import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { refBind } from '.'

describe('syncRef', () => {
  it('should work', () => {
    const a = ref(0)
    const b = refBind(a)
    expect(a.value).toBe(0)
    expect(b.value).toBe(0)

    b.value = 1
    expect(a.value).toBe(0)
    expect(b.value).toBe(1)

    a.value = 2
    expect(a.value).toBe(2)
    expect(b.value).toBe(2)

    b.value = 3
    expect(a.value).toBe(2)
    expect(b.value).toBe(3)
  })

  it('works with trigger source and ref value', () => {
    const a = ref(0)
    const b = ref(0)
    const c = refBind(a, b)

    c.value = 10
    expect(a.value).toBe(0)
    expect(b.value).toBe(0)
    expect(c.value).toBe(10)

    a.value = 5
    expect(a.value).toBe(5)
    expect(b.value).toBe(0)
    expect(c.value).toBe(10)

    b.value = 1
    expect(a.value).toBe(5)
    expect(b.value).toBe(1)
    expect(c.value).toBe(5)
  })

  it('works with trigger source and constant value', () => {
    const a = 0
    const b = ref(0)
    const c = refBind(a, b)

    c.value = 10
    expect(b.value).toBe(0)
    expect(c.value).toBe(10)

    b.value = 1
    expect(b.value).toBe(1)
    expect(c.value).toBe(0)
  })
})
