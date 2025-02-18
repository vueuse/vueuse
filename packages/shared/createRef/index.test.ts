import { describe, expect, it, vi } from 'vitest'
import { isShallow, nextTick, watch } from 'vue'
import { createRef } from '.'

describe('createRef', () => {
  it('should return a ref', async () => {
    const a = createRef(1)
    expect(a.value).toBe(1)
    a.value = 5
    expect(a.value).toBe(5)
    const b = createRef({ foo: 'bar', baz: 42 })
    const bSpy = vi.fn()
    watch(b, bSpy, { deep: true })
    expect(b.value.foo).toBe('bar')
    expect(b.value.baz).toBe(42)
    b.value.foo = 'baz'
    b.value.baz = 43
    await nextTick()
    expect(bSpy).not.toHaveBeenCalled()
    const c = createRef({ foo: 'bar', baz: 42 }, true)
    const cSpy = vi.fn()
    watch(c, cSpy, { deep: true })
    expect(c.value.foo).toBe('bar')
    expect(c.value.baz).toBe(42)
    c.value.foo = 'baz'
    c.value.baz = 43
    await nextTick()
    expect(cSpy).toHaveBeenCalledOnce()
  })

  describe('deep', () => {
    it('deep: default - returns shallow', () => {
      expect(isShallow(createRef(1))).toBe(true)
    })

    it('deep: true - returns deep', () => {
      expect(isShallow(createRef(1, true))).toBe(false)
    })

    it('deep: false - returns shallow', () => {
      expect(isShallow(createRef(1, false))).toBe(true)
    })
  })
})
