import { describe, expect, it, vi } from 'vitest'
import { ref as deepRef, nextTick, reactive } from 'vue'
import { watchClone } from './index'

describe('watchClone', () => {
  it('should work when receive ref object value', async () => {
    const spy = vi.fn((newVal, oldVal) => {
      expect(newVal.b.c).toEqual(100)
      expect(oldVal.b.c).toEqual(3)
    })
    const num = deepRef({
      a: 1,
      b: {
        c: 3,
      },
    })
    watchClone(num, spy, {
      deep: true,
    })
    num.value.b.c = 100
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work when receive reactive object', async () => {
    const spy = vi.fn((newVal, oldVal) => {
      expect(newVal.b.c).toEqual(100)
      expect(oldVal.b.c).toEqual(3)
    })
    const num = reactive({
      a: 1,
      b: {
        c: 3,
      },
    })
    watchClone(num, spy)
    num.b.c = 100
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work when receive a getter', async () => {
    const spy = vi.fn((newVal, oldVal) => {
      expect(newVal.b.c).toEqual(100)
      expect(oldVal.b.c).toEqual(3)
    })
    const num = reactive({
      a: 1,
      b: {
        c: 3,
      },
    })
    watchClone(() => num, spy, {
      deep: true,
    })
    num.b.c = 100
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
